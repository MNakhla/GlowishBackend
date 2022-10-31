const _ = require("lodash");
const Joi = require("joi");

const validate = (schema) => (req, res, next) => {
  const reqObject = _.pick(req, Object.keys(schema));
  const { error } = Joi.compile(schema).validate(reqObject);

  if (error) {
    res.status(400).send(error.details[0].message);
    // console.log(error.details[0].message);
    return;
  }
  next();
};
module.exports = {
  validate,
};
