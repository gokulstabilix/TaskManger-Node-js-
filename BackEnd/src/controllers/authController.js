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


exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Check if email and password exist
  if (!email || !password) {
    const error = new Error('Please provide email and password');
    error.statusCode = 400;
    return next(error);
  }

  // 2. Check if user exists && password is correct
  // We use .select('+password') because we set select: false in the schema
  const user = await User.findOne({ email }).select('+password');
  // 3. Check if user exists && password is correct
  // We use the method we added to the User model earlier
  if (!user || !(await user.correctPassword(password, user.password))) {
    const error = new Error('Incorrect email or password');
    error.statusCode = 401;
    return next(error);
  }

  // 4. If everything is okay, send the token back to the client
  const token = signToken(user._id);

  // 5. Remove password from output for security
  const userObj = user.toObject();
  delete userObj.password;

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user: userObj,
    },
  });
});