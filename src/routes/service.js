const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const { verifyJwt } = require("../middlewares/authentication");

const { serviceService } = require("../services");

router.route("/").get(verifyJwt, asyncHandler(serviceService.getById));

module.exports = router;
