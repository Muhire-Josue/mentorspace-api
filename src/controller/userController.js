/* eslint-disable max-len */
/* eslint-disable consistent-return */
import jwt from 'jsonwebtoken';
import hash from 'bcrypt-nodejs';
import dotenv from 'dotenv';
import userSchema from '../helper/userValidation';
import sessionSchema from '../helper/sessionValidation';
import User from '../model/user';
import Session from '../model/session';

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
      // eslint-disable-next-line max-len
      token, id: idNo, email, firstname, lastname, password: hashpsw, bio, address, occupation, expertise, status,
    });
    // eslint-disable-next-line max-len
    if (newUser.error) { return res.status(400).json({ status: 400, error: newUser.error.details[0].message }); }
    const DuplicateUser = User.find(u => u.email === req.body.email);
    if (DuplicateUser) {
      res.status(401).json({
        status: 401,
        error: 'Email already exist',
      });
    }
    User.push(newUser.value);
    res.status(201).json(
      {
        status: 201,
        message: 'User created successfully',
        token,
        data: newUser.value,
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
      return res.status(404).json({
        status: 404,
        error: 'user not found',
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
      return res.status(400).json({
        status: 400,
        error: 'password not matching',
      });
    }
    return res.status(200).json({
      status: 200,
      message: 'User is successfully logged in',
      token: jsToken,
      data: {
        id: user.id, email: user.email, userType: user.userType,
      },
    });
  }

  // Create mentorship session
  static createSession(req, res) {
    if (req.user.status === 'user') {
      const { questions, mentorId } = req.body;
      // eslint-disable-next-line radix
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

        if (session.error) { return res.status(403).json({ status: 403, error: session.error.details[0].message }); }
        Session.push(newSession);
        res.status(201).json({
          data: newSession,
        });
      } else {
        res.status(400).json({
          status: 400,
          error: 'Bad request',
          auth: req.user.status,
        });
      }
    } else {
      res.status(401).json({
        status: 401,
        error: 'Unauthorized access',
        auth: req.user.status,
      });
    }
  }
}


export default userController;
