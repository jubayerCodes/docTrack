import { Router } from 'express';
import { getAnalyticsSummary } from '../controllers/analyticsController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/summary', getAnalyticsSummary);

export default router;
