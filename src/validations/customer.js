const Joi = require("joi");
const JoiObjectId = require("joi-objectid")(Joi);

const getOneCustomerByIdSchema = {
  params: Joi.object().keys({
    _id: JoiObjectId().required(),
  }),
};

module.exports = { getOneCustomerByIdSchema };
