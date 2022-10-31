const Joi = require("joi");

const signupSchema = () => {
  body = Joi.object().keys({
    userType: Joi.string().required().valid("customer", "freelancer"),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
  });
};

const loginSchema = () => {
  body = Joi.object().keys({
    userType: Joi.string().required().valid("customer", "freelancer"),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  });
};
module.exports = { signupSchema, loginSchema };
