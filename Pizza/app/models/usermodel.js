const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: "USER",
    },
    image: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
    lat: {
      type: Number,
    },
    long: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports.User = new mongoose.model("user", userSchema);
