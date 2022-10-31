const Joi = require("joi");
const JoiObjectId = require("joi-objectid")(Joi);

//Freelancer

const getFreelancerByIdSchema = {
  // also used by getCustomerById
  params: Joi.object().keys({
    _id: JoiObjectId().required(),
  }),
};

const searchByDateAndLocSchema = {
  query: Joi.object().keys({
    latitude: Joi.string().required(),
    longitude: Joi.string().required(),
    date: Joi.date().required(),
    service: Joi.string().required(),
  }),
};

const updateNotificationSchema = {
  // also used in updateCustomerNotification
  params: Joi.object().keys({
    _id: JoiObjectId().required(),
    _notif_idx: Joi.number().required(),
  }),
};

//FreelancerProfile
const deletePortfolioImageSchema = {
  params: Joi.object().keys({
    _id: Joi.string().required(),
  }),
  body: Joi.object().keys({
    imageUrl: Joi.string().required(),
  }),
};

module.exports = {
  getFreelancerByIdSchema,
  deletePortfolioImageSchema,
  searchByDateAndLocSchema,
  updateNotificationSchema,
};
