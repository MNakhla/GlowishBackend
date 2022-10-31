const router = require("express").Router();
const freelancerRoutes = require("./freelancer");
const appointmentRoutes = require("./appointment");
const paymentRoutes = require("./payment");
const serviceRoutes = require("./service");
const freelancerProfileRoutes = require("./freelancerProfile");
const imageRoute = require("./image-route");
const customerRoutes = require("./customer");
const authRoutes = require("./auth");

router.use("/freelancer", freelancerRoutes);
router.use("/book", appointmentRoutes);
router.use("/pay", paymentRoutes);
router.use("/service", serviceRoutes);
router.use("/freelancerProfile", freelancerProfileRoutes);
router.use("/customer", customerRoutes);
router.use("/auth", authRoutes);
router.use("/image-upload", imageRoute);

module.exports = router;
