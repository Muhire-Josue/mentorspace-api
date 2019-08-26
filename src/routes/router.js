import express from 'express';
import userController from '../controller/userController';
import mentorController from '../controller/mentorController';
import auth from '../middleware/auth';

const router = express.Router();

// Sign up
router.post('/api/v1/auth/signup', userController.signUp);
// Sign in
router.post('/api/v1/auth/signin', userController.signIn);
// Get all mentors
router.get('/api/v1/auth/mentors', auth, mentorController.all);
// Create session
router.post('/api/v1/auth/sessions', auth, userController.createSession);

export default router;
