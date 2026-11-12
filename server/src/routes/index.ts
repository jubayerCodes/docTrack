import { Router } from 'express';
import doctorRoutes from './doctorRoutes';
import patientRoutes from './patientRoutes';
import sessionRoutes from './sessionRoutes';
import analyticsRoutes from './analyticsRoutes';

const router = Router();

// Modular application route registry
export const moduleRoutes = [
  {
    path: '/doctors',
    route: doctorRoutes,
  },
  {
    path: '/patients',
    route: patientRoutes,
  },
  {
    path: '/sessions',
    route: sessionRoutes,
  },
  {
    path: '/analytics',
    route: analyticsRoutes,
  },
];

// Loop through the route array to register each module once
moduleRoutes.forEach((module) => {
  router.use(module.path, module.route);
});

export default router;
