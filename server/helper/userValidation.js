/* eslint-disable newline-per-chained-call */
import Joi from '@hapi/joi';

const userSchema = Joi.object().keys({
  firstname: Joi.string().regex(/^[a-zA-Z]{3,30}$/).min(3).max(30).required(),
  lastname: Joi.string().regex(/^[a-zA-Z]{3,30}$/).min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(3).max(100).required(),
  address: Joi.string().alphanum().min(3).required(),
  bio: Joi.string().regex(/^[a-zA-Z ]{3,30}$/).min(3).max(30).required(),
  occupation: Joi.string().regex(/^[a-zA-Z ]{3,30}$/).min(3).max(30).required(),
  expertise: Joi.string().regex(/^[a-zA-Z ]{3,30}$/).min(3).max(30).required(),
  status: Joi.string().valid('user', 'mentor', 'admin').required(),
});

export default userSchema;
