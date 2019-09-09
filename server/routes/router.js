import express from 'express';
import userController from '../controller/userController';
const router = express.Router();

// Sign up
router.post('/api/v1/auth/signup', userController.signUp);


export default router;
