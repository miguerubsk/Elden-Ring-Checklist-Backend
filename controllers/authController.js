const mongoose = require("mongoose");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const conf = require("../jwt_secret/config");
const {
  createToken,
  maxAge,
  handleErrors,
} = require("../public/javascripts/auth");

let authcontroller = {};

/* Log-In */
authcontroller.login_get = (req, res, next) => {
  res.render("auth/login", { title: "Log-In" });
};

authcontroller.login_post = async (req, res, next) => {
  const { email, pass } = req.body;

  try {
    const user = await User.login(email, pass);
    const token = createToken(user._id, user.admin);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const error = handleErrors(err);
    console.log(error);
    res.status(400).json({ error });
  }
};

/* Register */
authcontroller.register_get = (req, res, next) => {
  res.render("auth/register", { title: "Register" });
};

authcontroller.register_post = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    const token = createToken(user._id, user.admin);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errs = handleErrors(err);
    res.status(400).json({ errs });
  }
};

/* Log-Out */
authcontroller.logout_get = (req, res, next) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

module.exports = authcontroller;
