import express from 'express';
import userController from '../controller/userController';
import mentorController from '../controller/mentorController';
import adminController from '../controller/adminController';
import auth from '../middleware/auth';

const router = express.Router();

// Sign up
router.post('/api/v1/auth/signup', userController.signUp);
// Sign in
router.post('/api/v1/auth/signin', userController.signIn);
// Get all mentors
router.get('/api/v1/auth/mentors', auth, mentorController.all);
// Get a mentor
router.get('/api/v1/auth/mentors/:id', auth, mentorController.findMentorById);
// Change user status to mentor
router.patch('/api/v1/auth/user/:userId', auth, adminController.userToMentor);
// Create session
router.post('/api/v1/auth/sessions', auth, userController.createSession);
// Accept session
router.patch('/api/v1/auth/sessions/:sessionId/accept', auth, mentorController.acceptSession);
// Reject session
router.patch('/api/v1/auth/sessions/:sessionId/reject', auth, mentorController.rejectSession);

export default router;
