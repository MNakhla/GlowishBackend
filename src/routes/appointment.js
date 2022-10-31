const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const { validate } = require("../middlewares/validation");
const {
  addAppointmentSchema,
  cancelAppointmentSchema,
} = require("../validations/appointment");

const { appointmentService } = require("../services");
const {
  verifyJwt,
  verifyCustomerPost,
  verifyCustomer,
} = require("../middlewares/authentication");

router
  .route("/")
  .post(
    verifyJwt,
    verifyCustomerPost,
    validate(addAppointmentSchema),
    asyncHandler(appointmentService.addAppointment)
  );

router
  .route("/cancelAppointment/:_id")
  .patch(
    verifyJwt,
    verifyCustomer,
    validate(cancelAppointmentSchema),
    asyncHandler(appointmentService.cancelAppointment)
  );

module.exports = router;
