import { Router } from 'express';
import {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorPatients,
} from '../controllers/doctorController';
import {
  createDoctorSession,
  deleteDoctorSession,
} from '../controllers/sessionController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Apply auth middleware to all doctor routes
router.use(authenticate);

// Doctor CRUD & Listing
router.route('/')
  .get(getDoctors)
  .post(createDoctor);

router.route('/:id')
  .get(getDoctorById)
  .put(updateDoctor)
  .delete(deleteDoctor);

// Assigned Patients & Session Management under Doctor
router.get('/:id/patients', getDoctorPatients);
router.post('/:id/sessions', createDoctorSession);
router.delete('/:id/sessions/:sessionId', deleteDoctorSession);

export default router;
