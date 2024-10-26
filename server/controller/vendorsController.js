const Vendor = require("../models/Vendors");
const Budget = require("../models/Budget");

//adding new vendors
const addVendor = async (req, res) => {
  try {
    const { vendorName, description, comments, category, contactNo, location } =
      req.body;
    if (!vendorName || !contactNo || !category || !location) {
      return res.status(400).json({ message: "Required fields are missing" });
    }
    let vendorDetails;
    switch (category) {
      case "Flower Shop":
        vendorDetails = { priceRange: req.body.priceRange };
        break;
      case "Lighting Shop":
        vendorDetails = { priceRange: req.body.priceRange };
        break;
      case "Designer":
        vendorDetails = { priceRange: req.body.priceRange };
        break;
      case "DJ":
        vendorDetails = {
          dayShiftPrice: req.body.dayShiftPrice,
          nightShiftPrice: req.body.nightShiftPrice,
        };
        break;
      case "Venue":
        vendorDetails = {
          capacity: req.body.capacity,
          pricePerDay: req.body.pricePerDay,
        };
        break;
      case "Caters":
        vendorDetails = {
          vegFoodPrice: req.body.vegFoodPrice,
          nonVegFoodPrice: req.body.nonVegFoodPrice,
        };
        break;
      case "Photographer":
        vendorDetails = { perDayCharge: req.body.perDayCharge };
        break;
      case "Makeup Artist":
        vendorDetails = { perFunctionPrice: req.body.perFunctionPrice };
        break;
      default:
        break;
    }

    const newVendor = new Vendor({
      vendorName,
      description,
      comments,
      category,
      contactNo,
      location,
      vendorDetails,
      bg: req.file.filename,
    });

    newVendor.images.push(req.file.filename);

    await newVendor.save();

    res
      .status(201)
      .json({ message: "Vendor added successfully", vendor: newVendor });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
};

const addVendorImage = async (req, res) => {
  try {
    const vendorId = req.params.id;

    const vendor = await Vendor.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    vendor.images.push(req.file.filename);
    await vendor.save();

    res.status(200).json({ message: "Image uploaded successfully", vendor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//add comments
const addComment = async (req, res) => {
  try {
    const vendorId = req.params.id;
    const { username, comment } = req.body;

    console.log(req.body);

    if (!username || !comment) {
      return res
        .status(400)
        .json({ message: "Username and comment are required" });
    }

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    vendor.comments.push({ username, comment });
    await vendor.save();

    const cmt = vendor.comments;
    res.status(200).json({ message: "Comment added successfully", cmt });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//fetching all vendors
const getVendors = async (req, res) => {
  await Vendor.find({}, "_id vendorName category bg vendorDetails")
    .then((data) => res.send({ status: 200, data: data }))
    .catch((err) => res.send({ status: 500, message: err.message }));
};

//fetch by category
const getVendorByCategory = async (req, res) => {
  const category = req.params.category;
  const limit = req.params.limit;
  await Vendor.find({ category: category })
    .limit(limit)
    .then((data) => res.send({ status: 200, data: data }))
    .catch((err) => res.send({ status: 500, mesage: err.mesage }));
};

//search vendor
const getByName = async (req, res) => {
  const name = req.params.name;
  await Vendor.findOne({ vendorName: name }, "_id")
    .then((data) => res.send({ status: 200, data: data }))
    .catch((err) => res.send({ status: 500, mesage: err.mesage }));
};

//specific vendor
const getSpecificVendor = async (req, res) => {
  await Vendor.findById(req.params.id)
    .then((data) => res.send({ status: 200, data: data }))
    .catch((err) => res.send({ status: 500, message: err.message }));
};

// Helper function to extract price from vendorDetails
const extractPrice = (vendorDetails, category) => {
  switch (category) {
    case "Flower Shop":
    case "Lighting Shop":
    case "Designer":
      return vendorDetails.priceRange[0];

    case "DJ":
      return vendorDetails.dayShiftPrice;

    case "Venue":
      return vendorDetails.pricePerDay;

    case "Caters":
      return (
        (parseFloat(vendorDetails.vegFoodPrice) +
          parseFloat(vendorDetails.nonVegFoodPrice)) /
        2
      );

    case "Photographer":
      return vendorDetails.perDayCharge;

    case "Makeup Artist":
      return vendorDetails.perFunctionPrice;

    default:
      return null;
  }
};

// get vendrod based on remaining budget
const getVendorByPrice = async (req, res) => {
  try {
    const userId = req.params.uid;
    const budgetData = await Budget.findOne({ userId: userId });

    if (!budgetData) {
      return res.status(404).send({ status: 404, message: "Budget not found" });
    }

    const remainingBudget = budgetData.remainingBudget;
    const vendors = await Vendor.find(
      {},
      "_id vendorName category bg vendorDetails"
    );
    const categorizedVendors = {};

    vendors.forEach((vendor) => {
      const price = extractPrice(vendor.vendorDetails, vendor.category);
      if (price !== null && price <= remainingBudget) {
        if (!categorizedVendors[vendor.category]) {
          categorizedVendors[vendor.category] = [];
        }
        categorizedVendors[vendor.category].push(vendor);
      }
    });

    res.send({ status: 200, data: categorizedVendors });
  } catch (err) {
    res.status(500).send({ status: 500, message: err.message });
  }
};

module.exports = {
  addVendor,
  getVendors,
  getSpecificVendor,
  addVendorImage,
  addComment,
  getVendorByCategory,
  getByName,
  getVendorByPrice,
};
