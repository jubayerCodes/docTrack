import { Router } from 'express';
import { getUsers, updateUserRole, deleteUser } from '../controllers/userController';
import { authenticate, authorizeRole } from '../middleware/auth';

const router = Router();

// Strict Admin-only middleware for all user management endpoints
router.use(authenticate);
router.use(authorizeRole('admin'));

router.get('/', getUsers);
router.patch('/:id/role', updateUserRole);
router.delete('/:id', deleteUser);

export default router;
