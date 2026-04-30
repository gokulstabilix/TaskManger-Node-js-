const User = require("../models/User");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");

// Helper function to create the Token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  // 1. Create the new user
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  // 2. Generate the JWT
  const token = signToken(newUser._id);

  // 3. Remove password from output
  const userObj = newUser.toObject();
  delete userObj.password;
  res.status(201).json({
    status: "success",
    token,
    data: {
      user: userObj,
    },
  });
});
