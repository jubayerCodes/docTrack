import { Router } from 'express';
import {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
} from '../controllers/patientController';
import { authenticate, authorizeRole } from '../middleware/auth';

const router = Router();

// Apply auth middleware to all patient routes (Admin only access)
router.use(authenticate);
router.use(authorizeRole('admin'));

router.route('/')
  .get(getPatients)
  .post(createPatient);

router.route('/:id')
  .get(getPatientById)
  .put(updatePatient)
  .delete(deletePatient);

export default router;
