import express from 'express';
import userController from '../controller/userController';
import auth from '../middleware/auth';
import mentorController from '../controller/mentorController';


const router = express.Router();

// Sign up
router.post('/api/v1/auth/signup', userController.signUp);
// Sign in
router.post('/api/v1/auth/signin', userController.signIn);
//All mentors
router.get('/api/v1/mentors', auth, mentorController.all);


export default router;
