/* eslint-disable consistent-return */
import jwt from 'jsonwebtoken';
import hash from 'bcrypt-nodejs';
import dotenv from 'dotenv';
import userSchema from '../helper/userValidation';
import User from '../model/user';

dotenv.config();

class userController {
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
}

export default userController;
