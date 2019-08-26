import Joi from '@hapi/joi';

const sessionSchema = Joi.object().keys({
  sessionId: Joi.number().required(),
  mentorId: Joi.number().required(),
  menteeId: Joi.number().required(),
  menteeEmail: Joi.string().email().required(),
  questions: Joi.string().min(2).required(),
  status: Joi.string().min(2).required(),

});

export default sessionSchema;
