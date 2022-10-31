const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const { verifyJwt, verifyCustomer } = require("../middlewares/authentication");
const { validate } = require("../middlewares/validation");

const { customerService } = require("../services");
const { updateNotificationSchema } = require("../validations/freelancer");
const { getOneCustomerByIdSchema } = require("../validations/customer");

router
  .route("/notif/:_id/:_notif_idx")
  .patch(
    verifyJwt,
    verifyCustomer,
    validate(updateNotificationSchema),
    asyncHandler(customerService.updateCustomerNotification)
  );
router
  .route("/getOne/:_id")
  .get(
    verifyJwt,
    verifyCustomer,
    validate(getOneCustomerByIdSchema),
    asyncHandler(customerService.getCustomer)
  );

module.exports = router;
