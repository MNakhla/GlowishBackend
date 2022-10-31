const Joi = require("joi");
const JoiObjectId = require("joi-objectid")(Joi);

const addAppointmentSchema = {
  body: Joi.object().keys({
    date: Joi.date().required(),
    location: Joi.object()
      .keys({
        address: Joi.string().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
      })
      .required(),
    freelancer: JoiObjectId().required(),
    customer: JoiObjectId().required(),
    services: Joi.array().items(JoiObjectId()).required(),
    price: Joi.number().required(),
    startTime: Joi.string().required(),
    endTime: Joi.string().required(),
    paymentIntentId: Joi.string().required(),
    freelancerDate: Joi.object()
      .keys({
        bDefault: Joi.boolean().required(),
        locationStatus: Joi.when("bDefault", {
          is: true,
          then: Joi.string().valid("OnTheMove", "AtSalon"),
        }),
        centerLocation: Joi.when("bDefault", {
          is: true,
          then: Joi.object()
            .keys({
              _id: JoiObjectId(),
              address: Joi.string().required(),
              latitude: Joi.number().required(),
              longitude: Joi.number().required(),
            })
            .required(),
        }),
        date: Joi.when("bDefault", {
          is: true,
          then: Joi.date().required(),
        }),
        offDay: Joi.when("bDefault", {
          is: true,
          then: Joi.boolean().required(),
        }),
        areaRadius: Joi.when("bDefault", {
          is: true,
          then: Joi.number().allow(null),
        }),
        specificDateAvailabilityId: Joi.when("bDefault", {
          is: false,
          then: JoiObjectId().required(),
        }),
        schedule: Joi.array()
          .items(
            Joi.array()
              .items(
                Joi.string().valid("disabled", "available", "booked").required()
              )
              .length(4)
          )
          .length(24)
          .required(),
      })
      .required(),
  }),
};
const cancelAppointmentSchema = {
  params: Joi.object().keys({
    _id: JoiObjectId().required(),
  }),
  query: Joi.object().keys({
    appointmentId: JoiObjectId().required(),
  }),
};
module.exports = { addAppointmentSchema, cancelAppointmentSchema };
