import express from 'express';
import userController from '../controller/userController';
import mentorController from '../controller/mentorController';
import auth from '../middleware/auth';

const router = express.Router();

router.post('/api/v1/auth/signup', userController.signUp);
router.post('/api/v1/auth/signin', userController.signIn);
router.get('/api/v1/auth/mentors', auth, mentorController.all);
router.get('/api/v1/auth/mentors/:id', auth, mentorController.findMentorById);
router.post('/api/v1/auth/sessions', auth, userController.createSession);

export default router;
