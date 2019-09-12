import Joi from '@hapi/joi';

const userSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(3).max(100).required(),
});

export default userSchema;