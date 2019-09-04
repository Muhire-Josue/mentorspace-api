import express from 'express';
import mentorController from '../controller/mentorController';
import auth from '../middleware/auth';

const router = express.Router();

router.patch('/api/v1/auth/sessions/:sessionId/accept', auth, mentorController.acceptSession);
router.patch('/api/v1/auth/sessions/:sessionId/reject', auth, mentorController.rejectSession);
export default router;