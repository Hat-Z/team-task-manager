import { Response } from 'express';
import { Task, TaskStatus } from '../models/Task.js';
import { Project } from '../models/Project.js';
import { AuthRequest } from '../middleware/auth.js';

export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { projectId } = req.params;
    const { title, description, assignedTo, priority, dueDate } = req.body;
    const userId = req.userId;

    const project = await Project.findById(projectId);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    if (req.userRole !== 'admin' && project.owner.toString() !== userId) {
      res.status(403).json({ message: 'Only admins or project owners can create tasks' });
      return;
    }

    if (!project.members.some((member) => member.toString() === assignedTo)) {
      res.status(400).json({ message: 'Assigned user is not a project member' });
      return;
    }

    const task = new Task({
      title,
      description,
      project: projectId,
      assignedTo,
      priority,
      dueDate,
      createdBy: userId,
    });

    await task.save();
    await task.populate(['assignedTo', 'createdBy']);

    res.status(201).json({
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getTasksByProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { projectId } = req.params;
    const userId = req.userId;

    const project = await Project.findById(projectId);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    const hasAccess =
      req.userRole === 'admin' ||
      project.owner.toString() === userId ||
      project.members.some((member) => member.toString() === userId);

    if (!hasAccess) {
      res.status(403).json({ message: 'You do not have access to this project' });
      return;
    }

    const tasks = await Task.find({ project: projectId }).populate(['assignedTo', 'createdBy']);

    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getTaskById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { taskId } = req.params;
    const userId = req.userId;

    const task = await Task.findById(taskId).populate(['assignedTo', 'createdBy', 'project']);

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    const project = await Project.findById(task.project);
    const hasAccess =
      req.userRole === 'admin' ||
      task.assignedTo._id.toString() === userId ||
      task.createdBy._id.toString() === userId ||
      project?.owner.toString() === userId ||
      project?.members.some((member) => member.toString() === userId);

    if (!hasAccess) {
      res.status(403).json({ message: 'You do not have access to this task' });
      return;
    }

    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { taskId } = req.params;
    const { title, description, status, priority, dueDate, assignedTo } = req.body;
    const userId = req.userId;

    const task = await Task.findById(taskId);

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    const project = await Project.findById(task.project);
    const isAdminOrManager =
      req.userRole === 'admin' || project?.owner.toString() === userId || task.createdBy.toString() === userId;
    const isAssignee = task.assignedTo.toString() === userId;

    if (!isAdminOrManager && !isAssignee) {
      res.status(403).json({ message: 'You do not have permission to update this task' });
      return;
    }

    if (isAdminOrManager) {
      task.title = title ?? task.title;
      task.description = description ?? task.description;
      task.priority = priority ?? task.priority;
      task.dueDate = dueDate ?? task.dueDate;

      if (assignedTo && project?.members.some((member) => member.toString() === assignedTo)) {
        task.assignedTo = assignedTo;
      }
    }

    task.status = status ?? task.status;

    await task.save();
    await task.populate(['assignedTo', 'createdBy']);

    res.status(200).json({
      message: 'Task updated successfully',
      task,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { taskId } = req.params;
    const userId = req.userId;

    const task = await Task.findById(taskId);

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    const project = await Project.findById(task.project);
    if (
      req.userRole !== 'admin' &&
      project &&
      project.owner.toString() !== userId &&
      task.createdBy.toString() !== userId
    ) {
      res.status(403).json({ message: 'You do not have permission to delete this task' });
      return;
    }

    await Task.findByIdAndDelete(taskId);

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    const tasks = await Task.find({ assignedTo: userId }).populate(['assignedTo', 'createdBy', 'project']);

    const stats = {
      total: tasks.length,
      todo: tasks.filter((t) => t.status === TaskStatus.TODO).length,
      inProgress: tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS).length,
      completed: tasks.filter((t) => t.status === TaskStatus.COMPLETED).length,
      overdue: tasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date()).length,
    };

    res.status(200).json({
      tasks,
      stats,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
