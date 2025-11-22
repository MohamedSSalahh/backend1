const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.getRegister = (req, res) => {
  res.render("register", { error: null });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exist = await User.findOne({ email });
    if (exist)
      return res.render("register", { error: "Email already exists" });

    const hashed = await bcrypt.hash(password.trim(), 10);

    await User.create({ name, email, password: hashed });

    res.redirect("/login");
  } catch (err) {
    res.render("register", { error: "Something went wrong" });
  }
};

exports.getLogin = (req, res) => {
  res.render("login", { error: null });
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.render("login", { error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password.trim(), user.password);
    if (!isMatch)
      return res.render("login", { error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, { httpOnly: true });
    res.redirect("/todos");
  } catch (err) {
    res.render("login", { error: "Something went wrong" });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
};
