import express from 'express';
import userController from '../controller/userController';
import auth from '../middleware/auth';
import mentorController from '../controller/mentorController';


const router = express.Router();


router.post('/api/v1/auth/signup', userController.signUp);
router.post('/api/v1/auth/signin', userController.signIn);
router.get('/api/v1/mentors', auth, mentorController.all);
router.get('/api/v1/auth/mentors/:id', auth, mentorController.findMentorById);
router.patch('/api/v1/auth/sessions/:sessionId/accept', auth, mentorController.acceptSession);

export default router;
