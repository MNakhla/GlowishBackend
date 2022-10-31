const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const { validate } = require("../middlewares/validation");
const Joi = require("joi");

const { verifyJwt, verifyCustomer } = require("../middlewares/authentication");

const { paymentService } = require("../services");
const {
  partialRefundSchema,
  fullRefundSchema,
  updateStatusSchema,
} = require("../validations/payment");

router
  .route("/partialRefund/:_id")
  .post(
    verifyJwt,
    verifyCustomer,
    validate(partialRefundSchema),
    asyncHandler(paymentService.partialRefund)
  );

router
  .route("/fullRefund/:_id")
  .post(
    verifyJwt,
    verifyCustomer,
    validate(fullRefundSchema),
    asyncHandler(paymentService.fullRefund)
  );

router
  .route("/updateStatus/:_id")
  .patch(
    verifyJwt,
    verifyCustomer,
    validate(updateStatusSchema),
    asyncHandler(paymentService.updatePaymentStatus)
  );

router
  .route("/:_id/secret")
  .post(
    verifyJwt,
    verifyCustomer,
    validate({ body: Joi.object().keys({ amount: Joi.number().greater(0) }) }),
    asyncHandler(paymentService.createSecret)
  );

module.exports = router;
