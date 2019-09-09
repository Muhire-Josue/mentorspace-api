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
      email, firstname, lastname, password, bio, address, occupation, expertise, status,
    });
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
      return res.status(500).json({ error })
    }

  }
}


export default userController;
