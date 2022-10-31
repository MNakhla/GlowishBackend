const router = require("express").Router();
const asyncHandler = require("express-async-handler");

const { freelancerProfileService, freelancerService } = require("../services");
const {
  verifyJwt,
  verifyFreelancer,
} = require("../middlewares/authentication");
const { validate } = require("../middlewares/validation");
const { deletePortfolioImageSchema } = require("../validations/freelancer");

router
  .route("/:_id")
  .get(verifyJwt, asyncHandler(freelancerService.getFreelancerById));
router
  .route("/complete/:_id")
  .put(
    verifyJwt,
    verifyFreelancer,
    asyncHandler(freelancerService.setFreelancerComplete)
  );

//#region post/put/delete service

router
  .route("/service/:_id")
  .post(
    verifyJwt,
    verifyFreelancer,
    asyncHandler(freelancerProfileService.postNewFreelancerService)
  );
router
  .route("/service/:_id/:serviceId")
  .put(
    verifyJwt,
    verifyFreelancer,
    asyncHandler(freelancerProfileService.putFreelancerService)
  );
router
  .route("/service/:_id/:serviceId")
  .delete(
    verifyJwt,
    verifyFreelancer,
    asyncHandler(freelancerProfileService.deleteFreelancerService)
  );

//#endregion

//#region profileImage
router
  .route("/:_id/profileImage")
  .put(
    verifyJwt,
    verifyFreelancer,
    asyncHandler(freelancerProfileService.postNewFreelancerProfileImg)
  );
//#endregion

//#region portfolio
router
  .route("/portfolio/delete/:_id")
  .put(
    verifyJwt,
    verifyFreelancer,
    validate(deletePortfolioImageSchema),
    asyncHandler(freelancerProfileService.deleteFreelancerPortfolioImg)
  );

router
  .route("/:_id/portfolio")
  .post(
    verifyJwt,
    verifyFreelancer,
    asyncHandler(freelancerProfileService.postNewFreelancerPortfolioImg)
  );
//#endregion

//#region post/put defaultAvailability
router
  .route("/defaultAvailability/:_id")
  .post(
    verifyJwt,
    verifyFreelancer,
    asyncHandler(freelancerProfileService.postFreelancerDefaultAvailability)
  );

router
  .route("/defaultAvailability/:_id")
  .put(
    verifyJwt,
    verifyFreelancer,
    asyncHandler(freelancerProfileService.putFreelancerDefaultAvailability)
  );
//#endregion

//#region post/put specificDateAvailability
router
  .route("/specificDateAvailability/:_id")
  .post(
    verifyJwt,
    verifyFreelancer,
    asyncHandler(
      freelancerProfileService.postFreelancerSpecificDateAvailability
    )
  );

router
  .route("/specificDateAvailability/:_id/:specificDateAvailabilityId")
  .put(
    verifyJwt,
    verifyFreelancer,
    asyncHandler(freelancerProfileService.putFreelancerSpecificDateAvailability)
  );

//#region post/put/delete info

router
  .route("/info/:_id/")
  .put(
    verifyJwt,
    verifyFreelancer,
    asyncHandler(freelancerProfileService.putFreelancerInfo)
  );

//#endregion

//#region post/put/delete info
router
  .route("/review/:_id/:customerId")
  .post(asyncHandler(freelancerProfileService.postFreelancerReview));

//#endregion

module.exports = router;
