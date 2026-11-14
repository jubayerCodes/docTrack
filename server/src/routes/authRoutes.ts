import { Router } from 'express';
import { registerUser, getMe } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public registration route
router.post('/register', registerUser);

// Authenticated current user profile
router.get('/me', authenticate, getMe);

export default router;
