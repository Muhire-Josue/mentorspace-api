import Mentor from '../model/user';
import Session from '../model/session';
import sucess from '../helper/endPointResponse/sucess';
import failure from '../helper/endPointResponse/failure';


class mentorController {
  // Get all Mentors
  static all(req, res) {
    const mentors = Mentor.filter(m => m.status === 'mentor');
    if (req.user.status === 'user' || req.user.status === 'admin') {
      const data = sucess('All mentors', 200, mentors);
      res.status(data.status).json({
        status: data.status,
        message: data.message,
        data: data.data,
      });
    } else {
      const data = failure('Unauthorized access', 401);
      res.status(data.status).json({
        status: data.status,
        error: data.message,
      });
    }
  }

  // Get a mentor
  static findMentorById(req, res) {
    const mentors = Mentor.filter(m => m.status === 'mentor');
    if (req.user.status === 'user') {
      const mentor = mentors.find(m => m.id === parseInt(req.params.id));
      if (mentor) {
        const data = sucess('Mentor profile', 200, mentor);
        res.status(data.status).json({
          status: data.status,
          message: data.message,
          data: data.data,
        });
      } else {
        const data = failure('Mentor not found', 404);
        res.status(404).json({
          status: 404,
          error: data.message,

        });
      }
    } else {
      const data = failure('Unauthorized access', 401);
      res.status(data.status).json({
        status: data.status,
        error: data.message,
      });
    }
  }


  static acceptSession(req, res) {
    if (req.user.status === 'mentor') {
      const id = req.params.sessionId;
      const session = Session.find(s => s.sessionId === parseInt(id));
      if (session) {
        if (req.user.id === session.mentorId) {
          session.status = 'accepted';
          const data = sucess('Session accepted', 200, session);
          res.status(data.status).json({
            status: data.status,
            message: data.message,
            data: data.data,
          });
        } else {
          const data = failure('Unauthorized access', 401);
          res.status(data.status).json({
            status: data.status,
            error: data.message,
          });
        }
      } else {
        const data = failure('session not found', 404);
        res.status(data.status).json({
          status: data.status,
          error: data.message,
        });
      }
    } else {
      const data = failure('Unauthorized access', 400);
      res.status(data.status).json({
        status: data.status,
        error: data.message,
      });
    }
  }


  static rejectSession(req, res) {
    if (req.user.status === 'mentor') {
      const id = req.params.sessionId;
      const session = Session.find(s => s.sessionId === parseInt(id));
      if (session) {
        if (req.user.id === session.mentorId) {
          session.status = 'rejected';
          const data = sucess('Session rejected', 200, session);
          res.status(data.status).json({
            status: 200,
            message: data.message,
            data: data.data,
          });
        } else {
          const data = failure('Unauthorized access', 401);
          res.status(data.status).json({
            status: data.status,
            error: data.message,
          });
        }
      } else {
        const data = failure('session not found', 404);
        res.status(data.status).json({
          status: data.status,
          error: data.message,
        });
      }
    } else {
      const data = failure('Unauthorized access', 400);
      res.status(data.status).json({
        status: data.status,
        error: data.message,
      });
    }
  }
}

export default mentorController;
