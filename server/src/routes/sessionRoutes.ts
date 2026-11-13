import { Router } from 'express';
import {
  getSessions,
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
} from '../controllers/sessionController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

// Session collection routes (/api/v1/sessions)
router.route('/')
  .get(getSessions)
  .post(createSession);

// Individual session routes (/api/v1/sessions/:sessionId)
router.route('/:sessionId')
  .get(getSessionById)
  .patch(updateSession)
  .delete(deleteSession);

export default router;
