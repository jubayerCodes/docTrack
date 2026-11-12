import { Router } from 'express';
import { updateSession } from '../controllers/sessionController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

// Update status, notes, or time
router.patch('/:sessionId', updateSession);

export default router;
