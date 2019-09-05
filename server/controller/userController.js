import jwt from 'jsonwebtoken';
import hash from 'bcrypt-nodejs';
import dotenv from 'dotenv';
import userSchema from '../helper/userValidation';
import sessionSchema from '../helper/sessionValidation';
import User from '../model/user';
import Session from '../model/session';
import sucess from '../helper/endPointResponse/sucess';
import failure from '../helper/endPointResponse/failure';

dotenv.config();

class userController {
  // SignUp
  static signUp(req, res) {
    const {
      firstname, lastname, email, password, address, bio, occupation, expertise, status,
    } = req.body;


    const idNo = User.length + 1;
    const hashpsw = hash.hashSync(password);
    const token = jwt.sign({
      id: idNo, email, firstname, lastname, address, status,
    }, process.env.API_SERCRET_KEY);
    const newUser = userSchema.validate({
      token, id: idNo, email, firstname, lastname, password: hashpsw, bio, address, occupation, expertise, status,
    });
    if (newUser.error) {
      const data = failure(newUser.error.details[0].message, 400);
      return res.status(data.status).json({ status: data.status, error: data.message });
    }
    const DuplicateUser = User.find(u => u.email === req.body.email);
    if (DuplicateUser) {
      const data = failure('Email already exist', 401);
      res.status(data.status).json({
        status: data.status,
        error: data.message,
      });
    }
    User.push(newUser.value);
    const data = sucess('User created successfully', 201, newUser.value);
    res.status(data.status).json(
      {
        status: data.status,
        message: data.message,
        token,
        data: data.data,
      },
    );
  }

  // SignIn
  static signIn(req, res) {
    const {
      email, password,
    } = req.body;
    const user = User.find(u => u.email === email.toLowerCase());
    if (!user) {
      const data = failure('user not found', 404);
     return res.status(data.status).json({
        status: data.status,
        error: data.message,
      });
    }
    const {
      firstname, lastname, pass, address, status,
    } = user;
    const jsToken = jwt.sign({
      id: user.id, email, firstname, lastname, pass, address, status,
    }, process.env.API_SERCRET_KEY);
    const comparePassword = hash.compareSync(password, user.password);
    if (!comparePassword) {
      const data = failure('password not matching', 400);
     return res.status(data.status).json({
        status: data.status,
        error: data.message,
      });
    }
    let object = {
      id: user.id,
      email: user.email,
      status: user.status
    }
    const data = sucess('User is successfully logged in', 200, object);
  return  res.status(data.status).json({
      status: data.status,
      message: data.message,
      token: jsToken,
      data: data.data
    });
  }

  static createSession(req, res) {
    if (req.user.status === 'user') {
      const { questions, mentorId } = req.body;
      const mentor = User.find(u => u.id === parseInt(mentorId));
      if (mentor.status === 'mentor') {
        const newSession = {};
        newSession.sessionId = Session.length + 1;
        newSession.mentorId = mentorId;
        newSession.menteeId = req.user.id;
        newSession.questions = questions;
        newSession.menteeEmail = req.user.email;
        newSession.status = 'pending';

        const {
          sessionId, menteeId, menteeEmail, status,
        } = newSession;
        const session = sessionSchema.validate({
          sessionId,
          mentorId,
          menteeId,
          menteeEmail,
          questions,
          status,
        });

        if (session.error) {
          const err = failure(session.error.details[0].message, 403);
          return res.status(err.status).json(err);
        }
        Session.push(newSession);
        const result = sucess('Session created successfully', 201, newSession);
        return res.status(result.status).json(result);
      } else {
        const err = failure('Bad request', 400);
        return res.status(err.status).json(err);
      }
    } else {
      const err = failure('Unauthorized access', 401);
      return res.status(err.status).json(err);
    }
  }
}

export default userController;