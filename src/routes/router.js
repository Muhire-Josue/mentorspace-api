import express from 'express';
import userController from '../controller/userController';
import auth from '../middleware/auth';

const router = express.Router();

// Sign up
router.post('/api/v1/auth/signup', userController.signUp);
// Sign in
router.post('/api/v1/auth/signin', userController.signIn);
// Create session
router.post('/api/v1/auth/sessions', auth, userController.createSession);

export default router;
