const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const {
  verifyJwt,
  verifyFreelancer,
} = require("../middlewares/authentication");
const { freelancerService } = require("../services");
const { validate } = require("../middlewares/validation");
const {
  getFreelancerByIdSchema,
  searchByDateAndLocSchema,
  updateNotificationSchema,
} = require("../validations/freelancer");

router.route("/").get(asyncHandler(freelancerService.getAll));
router
  .route("/search")
  .get(
    validate(searchByDateAndLocSchema),
    asyncHandler(freelancerService.searchByDateAndLoc)
  );

router
  .route("/:_id")
  .get(
    verifyJwt,
    validate(getFreelancerByIdSchema),
    asyncHandler(freelancerService.getFreelancerById)
  );

router
  .route("/notif/:_id/:_notif_idx")
  .patch(
    verifyJwt,
    verifyFreelancer,
    validate(updateNotificationSchema),
    asyncHandler(freelancerService.updateFreelancerNotification)
  );

module.exports = router;
