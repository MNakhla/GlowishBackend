const router = require("express").Router();
const asyncHandler = require("express-async-handler");

const { authService } = require("../services");
const { authMidWare } = require("../middlewares");
const { signupSchema, loginSchema } = require("../validations/auth");
const { validate } = require("../middlewares/validation");

router
  .route("/login")
  .post(validate(loginSchema), asyncHandler(authService.handleLogin));
router
  .route("/signup")
  .post(
    validate(signupSchema),
    authMidWare.verifySignUp,
    asyncHandler(authService.handleSignup)
  );

module.exports = router;
