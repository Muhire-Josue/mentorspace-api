import express from 'express';
import userController from '../controller/userController';

const router = express.Router();

// Sign up
router.post('/api/v1/auth/signup', userController.signUp);
// Sign in
router.post('/api/v1/auth/signin', userController.signIn);

export default router;
