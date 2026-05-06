import express, { Router } from 'express';
import { body } from 'express-validator';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMemberToProject,
  removeMemberFromProject,
} from '../controllers/projectController.js';
import { adminOnly, authMiddleware } from '../middleware/auth.js';
import { checkProjectMembership } from '../middleware/authorization.js';
import { handleValidationErrors } from '../middleware/validation.js';

const router: Router = express.Router();

router.post(
  '/',
  authMiddleware,
  adminOnly,
  [body('name').notEmpty().trim(), body('description').optional().trim()],
  handleValidationErrors,
  createProject
);

router.get('/', authMiddleware, getProjects);

router.get('/:projectId', authMiddleware, getProjectById);

router.put(
  '/:projectId',
  authMiddleware,
  checkProjectMembership,
  [body('name').optional().trim(), body('description').optional().trim()],
  handleValidationErrors,
  updateProject
);

router.delete('/:projectId', authMiddleware, deleteProject);

router.post(
  '/:projectId/members',
  authMiddleware,
  [body('memberId').optional().isMongoId(), body('memberEmail').optional().isEmail()],
  handleValidationErrors,
  addMemberToProject
);

router.delete(
  '/:projectId/members',
  authMiddleware,
  [body('memberId').notEmpty()],
  handleValidationErrors,
  removeMemberFromProject
);

export default router;
