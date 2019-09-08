import jwt from 'jsonwebtoken';
import hash from 'bcrypt-nodejs';
import dotenv from 'dotenv';
import userSchema from '../helper/userValidation';
import sessionSchema from '../helper/sessionValidation';
import db from '../model';

dotenv.config();

class userController {
  // SignUp
  static async signUp(req, res) {
    const {
      firstname, lastname, email, password, address, bio, occupation, expertise, status,
    } = req.body;

    const newUser = userSchema.validate({
      // eslint-disable-next-line max-len
      email, firstname, lastname, password, bio, address, occupation, expertise, status,
    });
    // eslint-disable-next-line max-len
    if (newUser.error) { return res.status(400).json({ status: 400, error: newUser.error.details[0].message }); }

    const text = `INSERT INTO
    users(firstname, lastname, email, password, address, bio, occupation, expertise, status)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
    returning id, firstname, lastname, email, password, address, bio, occupation, expertise, status, "createdDate"`;

    const values = [
      firstname, lastname, email, hash.hashSync(password), address, bio, occupation, expertise, status,
    ];

    try {
      const checkUser = await db.query('SELECT * FROM users WHERE email=$1', [email]);
      if (checkUser.rows.length > 0) {
        return res.status(401).json({
          status: 401,
          error: 'Email already exist',
        });
      }

      const { rows } = await db.query(text, values);

      const token = jwt.sign(rows[0], process.env.API_SERCRET_KEY);

      return res.status(201).json(
        {
          status: 201,
          message: 'User created successfully',
          token,
          data: rows[0],
        },
      );

    } catch (error) {
      return res.status(500).json({ error })
    }

  }

  // SignIn
  static async signIn(req, res) {
    const {
      email, password,
    } = req.body;
    // const user = User.find(u => u.email === email.toLowerCase());
    const {rows} = await db.query('SELECT * FROM users WHERE email=$1', [email]);

    if (!rows.length > 0) {
      return res.status(404).json({
        status: 404,
        error: 'user not found',
      });
    }
    const {
      firstname, lastname, pass, address, status,
    } = rows[0];
    const jsToken = jwt.sign({
      id: rows[0].id, email, firstname, lastname, pass, address, status,
    }, process.env.API_SERCRET_KEY);
    const comparePassword = hash.compareSync(password, rows[0].password);
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
        id: rows[0].id, email: rows[0].email, status: rows[0].status,
      },
    });
  }

  // Create mentorship session
  static async createSession(req, res) {
    if (req.user.status === 'user') {
      const { questions, mentorId } = req.body;
      const mentor = await db.query('SELECT * FROM users WHERE id=$1', [mentorId]);
      if (mentor.rows.length < 1) {
        return res.status(404).json({
          status: 404,
          error: 'User doesn\'t exist',
        });
      }
      if (mentor.rows[0].status === 'mentor') {
        const newSession = {
          mentorId: mentorId,
          menteeId: req.user.id,
          questions: questions,
          menteeEmail: req.user.email,
          status: 'pending'
        };

        const session = sessionSchema.validate(newSession);

        if (session.error) { return res.status(403).json({ status: 403, error: session.error.details[0].message }); }

        const text = `INSERT INTO
                      sessions("mentorId", "menteeId", questions, menteeEmail, status)
                      VALUES($1, $2, $3, $4, $5)
                      returning *`;

        const values = [newSession.mentorId, newSession.menteeId, newSession.questions, newSession.menteeEmail, newSession.status];
        const { rows } = await db.query(text, values);
        return res.status(201).json({
          data: rows[0]
        });
      } else {
        return res.status(400).json({
          status: 400,
          error: 'Bad request',
        });
      }
    } else {
      return res.status(401).json({
        status: 401,
        error: 'Unauthorized access',
        auth: req.user.status,
      });
    }
  }
}


export default userController;
