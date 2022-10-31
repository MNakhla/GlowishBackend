const Joi = require("joi");
const JoiObjectId = require("joi-objectid")(Joi);

const partialRefundSchema = {
  params: Joi.object().keys({
    _id: JoiObjectId().required(),
  }),
  body: Joi.object().keys({ amount: Joi.number().greater(0) }),
  query: Joi.object().keys({ paymentIntentId: Joi.string().required() }),
};

const fullRefundSchema = {
  params: Joi.object().keys({
    _id: JoiObjectId().required(),
  }),

  query: Joi.object().keys({ paymentIntentId: Joi.string().required() }),
};

const updateStatusSchema = {
  params: Joi.object().keys({
    _id: JoiObjectId().required(),
  }),
  body: Joi.object().keys({
    paymentStatus: Joi.valid(
      "early_cancellation",
      "late_cancellation",
      "success"
    ).required(),
  }),
  query: Joi.object().keys({ paymentIntentId: Joi.string().required() }),
};

module.exports = { partialRefundSchema, fullRefundSchema, updateStatusSchema };
