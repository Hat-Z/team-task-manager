import { Response } from 'express';
import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { User } from '../models/User.js';
import { AuthRequest } from '../middleware/auth.js';

export const createProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;
    const userId = req.userId;

    const project = new Project({
      name,
      description,
      owner: userId,
      members: [userId],
    });

    await project.save();
    await project.populate(['owner', 'members']);

    res.status(201).json({
      message: 'Project created successfully',
      project,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getProjects = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    const query =
      req.userRole === 'admin' ? {} : { $or: [{ owner: userId }, { members: userId }] };

    const projects = await Project.find(query).populate(['owner', 'members']);

    res.status(200).json({ projects });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getProjectById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { projectId } = req.params;
    const userId = req.userId;

    const project = await Project.findById(projectId).populate(['owner', 'members']);

    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    const isOwner = project.owner._id.toString() === userId;
    const isMember = project.members.some((member: any) => member._id.toString() === userId);
    if (req.userRole !== 'admin' && !isOwner && !isMember) {
      res.status(403).json({ message: 'You do not have access to this project' });
      return;
    }

    res.status(200).json({ project });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { projectId } = req.params;
    const { name, description } = req.body;
    const userId = req.userId;

    const project = await Project.findById(projectId);

    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    if (req.userRole !== 'admin' && project.owner.toString() !== userId) {
      res.status(403).json({ message: 'Only admins or project owners can update projects' });
      return;
    }

    project.name = name || project.name;
    project.description = description || project.description;
    await project.save();
    await project.populate(['owner', 'members']);

    res.status(200).json({
      message: 'Project updated successfully',
      project,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { projectId } = req.params;
    const userId = req.userId;

    const project = await Project.findById(projectId);

    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    if (req.userRole !== 'admin' && project.owner.toString() !== userId) {
      res.status(403).json({ message: 'Only admins or project owners can delete projects' });
      return;
    }

    await Task.deleteMany({ project: projectId });
    await Project.findByIdAndDelete(projectId);

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const addMemberToProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { projectId } = req.params;
    const { memberId, memberEmail } = req.body;
    const userId = req.userId;

    const project = await Project.findById(projectId);

    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    if (req.userRole !== 'admin' && project.owner.toString() !== userId) {
      res.status(403).json({ message: 'Only admins or project owners can add members' });
      return;
    }

    const member = memberId
      ? await User.findById(memberId)
      : await User.findOne({ email: memberEmail?.toLowerCase() });

    if (!member) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (project.members.some((id) => id.toString() === member._id.toString())) {
      res.status(400).json({ message: 'User is already a member' });
      return;
    }

    project.members.push(member._id);
    await project.save();
    await project.populate(['owner', 'members']);

    res.status(200).json({
      message: 'Member added successfully',
      project,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const removeMemberFromProject = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { projectId } = req.params;
    const { memberId } = req.body;
    const userId = req.userId;

    const project = await Project.findById(projectId);

    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    if (req.userRole !== 'admin' && project.owner.toString() !== userId) {
      res.status(403).json({ message: 'Only admins or project owners can remove members' });
      return;
    }

    if (project.owner.toString() === memberId) {
      res.status(400).json({ message: 'Project owner cannot be removed from the project' });
      return;
    }

    project.members = project.members.filter((id) => id.toString() !== memberId);
    await project.save();
    await project.populate(['owner', 'members']);

    res.status(200).json({
      message: 'Member removed successfully',
      project,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
