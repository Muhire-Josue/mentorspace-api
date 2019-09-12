import jwt from 'jsonwebtoken';
import hash from 'bcrypt-nodejs';
import dotenv from 'dotenv';
import userSchema from '../helper/userValidation';
import loginSchema from '../helper/loginValidation';
import sessionSchema from '../helper/sessionValidation';
import db from '../model';

dotenv.config();

class userController {
  static async signUp(req, res) {
    const {
      firstname, lastname, email, password, address, bio, occupation, expertise, status,
    } = req.body;

    const newUser = userSchema.validate({
      email, firstname, lastname, password, bio, address, occupation, expertise, status,
    });
    if (newUser.error) { return res.status(400).json({ status_code: 400, error: newUser.error.details[0].message }); }

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
        return res.status(409).json({
          status_code: 409,
          error: 'Email already exist',
        });
      }

      const { rows } = await db.query(text, values);

      const token = jwt.sign(rows[0], process.env.API_SERCRET_KEY);

      return res.status(201).json(
        {
          status_code: 201,
          message: 'User created successfully',
          data: {
            token: token,
            id: rows[0].id,
            firstname: rows[0].firstname,
            lastname: rows[0].lastname,
            email: rows[0].email,
            address: rows[0].address,
            bio: rows[0].bio,
            expertise: rows[0].expertise,
            occupation: rows[0].occupation,
            status: rows[0].status
          }
        },
      );

    } catch (error) {
      return res.status(500).json({ status_code: 500, error: error })
    }

  }
  static async signIn(req, res) {
    try {
      const {
        email, password,
      } = req.body;
      const { rows } = await db.query('SELECT * FROM users WHERE email=$1', [email]);

      if (!rows.length > 0) {
        return res.status(404).json({
          status_code: 404,
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
          status_code: 400,
          error: 'password not matching',
        });
      }
      return res.status(200).json({
        status_code: 200,
        message: 'User is successfully logged in',
        data: {
          token: jsToken, id: rows[0].id, email: rows[0].email, status: rows[0].status,
        },
      });
    } catch (error) {
      return res.status(400).json({
        status_code: 400,
        error: 'bad request',
      });
    }
  }

  static async createSession(req, res) {
    if (req.user.status === 'user') {
      const { questions, mentorId } = req.body;
      const mentor = await db.query('SELECT * FROM users WHERE id=$1', [mentorId]);
      if (mentor.rows.length < 1) {
        return res.status(404).json({
          status_code: 404,
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

        if (session.error) { return res.status(403).json({ status_code: 403, error: session.error.details[0].message }); }

        const text = `INSERT INTO
                      sessions("mentorId", "menteeId", questions, menteeEmail, status)
                      VALUES($1, $2, $3, $4, $5)
                      returning *`;

        const values = [newSession.mentorId, newSession.menteeId, newSession.questions, newSession.menteeEmail, newSession.status];

        const sessions = await db.query('SELECT * FROM sessions WHERE "mentorId"=$1 AND questions=$2',[mentorId, questions]);
        
        if (typeof sessions.rows[0] === 'object') {          
          return res.status(409).json({
            status_code: 409,
            error: 'Session request already exists',
          });
        }
        const { rows } = await db.query(text, values);
        return res.status(201).json({
          status_code: 201,
          message: "Session created successfully!",
          data: rows[0]
        });
      } else {
        return res.status(400).json({
          status_code: 400,
          error: 'Bad request',
        });
      }
    } else {
      return res.status(401).json({
        status_code: 401,
        error: 'Unauthorized access',
      });
    }
  }
}


export default userController;
