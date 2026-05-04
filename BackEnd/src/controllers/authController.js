const User = require("../models/User");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const { promisify } = require('util');

// Helper function to create the Token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

/**
 * createSendToken — Creates a JWT, sets it as an HttpOnly cookie,
 * and sends the user data in the response body (without the token).
 */
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,   // 👈 Cannot be accessed by JavaScript
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/', // 👈 Ensure cookie is sent for ALL routes
  };

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  // ⚠️ Token is NOT sent in the JSON body — the HttpOnly cookie is the only auth mechanism
  res.status(statusCode).json({
    status: 'success',
    data: { user },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  // 1. Create the new user
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  // 2. Sign token, set cookie, and respond
  createSendToken(newUser, 201, res);
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
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    const error = new Error('Incorrect email or password');
    error.statusCode = 401;
    return next(error);
  }

  // 3. If everything is okay, set cookie and respond
  createSendToken(user, 200, res);
});


exports.protect = catchAsync(async (req, res, next) => {
  let token;

  // 1. Get token — prefer cookie, fall back to Bearer header
  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    const error = new Error('You are not logged in! Please log in to get access.');
    error.statusCode = 401;
    return next(error);
  }

  // 2. Verify token
  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    
    // 3. Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      const error = new Error('The user belonging to this token no longer exists.');
      error.statusCode = 401;
      return next(error);
    }

    // 4. GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  } catch (err) {
    // Catch any JWT error (malformed, expired, etc.) and return 401
    const error = new Error('Invalid or expired token. Please log in again.');
    error.statusCode = 401;
    return next(error);
  }
});


/**
 * getMe — Returns the currently logged-in user's data.
 * Must be called after the `protect` middleware (which attaches req.user).
 */
exports.getMe = catchAsync(async (req, res, next) => {
  // req.user is already set by the protect middleware
  const user = req.user;
  user.password = undefined;

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});


/**
 * logout — Clears the JWT cookie to end the session.
 * Sends back a tiny expired cookie that the browser will discard.
 */
exports.logout = (req, res) => {
  res.cookie('jwt', '', {
    expires: new Date(Date.now()),
    httpOnly: true,
    path: '/', // 👈 Must match the path used when setting the cookie
  });

  res.status(200).json({ status: 'success' });
};