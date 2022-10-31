const router = require("express").Router();
const multer = require("multer");

const { firebaseImageStorage } = require("../services");
const { verifyJwt } = require("../middlewares/authentication");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("file"); // POST - Add Image to Cloud Storage

router.post("/upload", verifyJwt, upload, firebaseImageStorage.addImage);

module.exports = router;
