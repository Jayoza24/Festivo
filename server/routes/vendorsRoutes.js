const express = require("express");
const router = express.Router();
const {
  addVendor,
  getVendors,
  getSpecificVendor,
  addVendorImage,
  addComment,
  getVendorByCategory,
  getByName,
  getVendorByPrice
} = require("../controller/vendorsController");
const upload = require("../middlewares/uploadMiddleware");

//Route to get vendors
router.get("/allVendors", getVendors);
//Route to add vendors with file upload
router.post("/addVendor", upload.single("vendorImage"), addVendor);
//route to get vendor by category
router.get("/:category&:limit", getVendorByCategory);
//specific vendor
router.get("/getVendor/:id", getSpecificVendor);
//Route to add Images in specific vendor images
router.post("/addVendorImages/:id", upload.single("image"), addVendorImage);
//Route to add comments
router.post("/addComment/:id", addComment);
//route to search vendor by name
router.get("/getByName/:name", getByName);
//route to get vendors by budget
router.get("/getVendorByPrice/:uid", getVendorByPrice);

module.exports = router;
