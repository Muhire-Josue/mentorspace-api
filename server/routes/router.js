import express from 'express';
import userController from '../controller/userController';
// import mentorController from '../controller/mentorController';
// import adminController from '../controller/adminController';
// import auth from '../middleware/auth';

const router = express.Router();

// Sign up
router.post('/api/v1/auth/signup', userController.signUp);


export default router;
