import express from 'express';
import adminController from '../controller/adminController';
import auth from '../middleware/auth';

const router = express.Router();

router.patch('/api/v1/auth/user/:userId', auth, adminController.userToMentor);
export default router;