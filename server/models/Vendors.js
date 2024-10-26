  const mongoose = require("mongoose");

  const commentSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

  const vendorSchema = new mongoose.Schema({
    vendorName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    comments: [commentSchema],
    category: {
      type: String,
      required: true,
    },
    contactNo: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    bg: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
    },
    vendorDetails: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  });

  const Vendor = mongoose.model("Vendor", vendorSchema);
  module.exports = Vendor;
