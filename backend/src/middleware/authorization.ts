import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.js';
import { Project } from '../models/Project.js';

export const checkProjectMembership = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { projectId } = req.params;
    const userId = req.userId;

    const project = await Project.findById(projectId);

    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    const isOwner = project.owner.toString() === userId;
    const isMember = project.members.some((member) => member.toString() === userId);

    if (!isOwner && !isMember) {
      res.status(403).json({ message: 'You do not have access to this project' });
      return;
    }

    req.params.isOwner = isOwner.toString();
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
