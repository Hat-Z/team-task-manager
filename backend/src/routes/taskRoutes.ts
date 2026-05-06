import express, { Router } from 'express';
import { body } from 'express-validator';
import {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask,
  getDashboard,
} from '../controllers/taskController.js';
import { authMiddleware } from '../middleware/auth.js';
import { handleValidationErrors } from '../middleware/validation.js';

const router: Router = express.Router();

router.get('/dashboard', authMiddleware, getDashboard);

router.get('/task/:taskId', authMiddleware, getTaskById);

router.post(
  '/:projectId',
  authMiddleware,
  [
    body('title').notEmpty().trim(),
    body('description').optional().trim(),
    body('assignedTo').notEmpty(),
    body('priority').optional(),
    body('dueDate').optional(),
  ],
  handleValidationErrors,
  createTask
);

router.get('/:projectId', authMiddleware, getTasksByProject);

router.put(
  '/:taskId',
  authMiddleware,
  [
    body('title').optional().trim(),
    body('description').optional().trim(),
    body('status').optional(),
    body('priority').optional(),
    body('dueDate').optional(),
    body('assignedTo').optional(),
  ],
  handleValidationErrors,
  updateTask
);

router.delete('/:taskId', authMiddleware, deleteTask);

export default router;
