/* eslint-disable radix */
import Mentor from '../model/user';
// import Session from '../model/session';
// import jwt from 'jsonwebtoken';
// import hash from 'bcrypt-nodejs';
// import mentortValidation from './validation/userValidation';

class mentorController {
  // Get all Mentors
  static all(req, res) {
    const mentors = Mentor.filter(m => m.status === 'mentor');
    if (req.user.status === 'user' || req.user.status === 'admin') {
      res.status(200).json({
        status: 200,
        data: mentors,
      });
    } else {
      res.status(401).json({
        status: 401,
        error: 'Unauthorized access',
      });
    }
  }

  // Get a mentor
  static findMentorById(req, res) {
    const mentors = Mentor.filter(m => m.status === 'mentor');
    if (req.user.status === 'user') {
      const mentor = mentors.find(m => m.id === parseInt(req.params.id));
      if (mentor) {
        res.status(200).json({
          status: 200,
          data: mentor,
        });
      } else {
        res.status(404).json({
          status: 404,
          error: 'Mentor not found',

        });
      }
    } else {
      res.status(401).json({
        status: 401,
        error: 'Unauthorized access',
      });
    }
  }
}

export default mentorController;
