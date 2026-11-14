import { Router } from 'express';
import {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorPatients,
} from '../controllers/doctorController';
import { authenticate, authorizeRole } from '../middleware/auth';

const router = Router();

// Apply auth middleware to all doctor routes (Admin only access)
router.use(authenticate);
router.use(authorizeRole('admin'));

// Doctor CRUD & Listing
router.route('/')
  .get(getDoctors)
  .post(createDoctor);

router.route('/:id')
  .get(getDoctorById)
  .put(updateDoctor)
  .delete(deleteDoctor);

// Assigned Patients under Doctor
router.get('/:id/patients', getDoctorPatients);

export default router;
