const express = require("express");
const { registerUser, authUser, uploadProfileImage, getProfileImage, upload } = require("../controller/userController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", authUser);
router.post("/profile/image/:id", upload.single("file"), uploadProfileImage);
router.get("/profile/image/:id", getProfileImage);

module.exports = router;
