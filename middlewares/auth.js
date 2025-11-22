const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.cookies.token;
  console.log("Auth middleware, token:", token);

  if (!token) {
    console.log("No token, redirecting to /login");
    return res.redirect("/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decoded:", decoded);
    req.user = decoded.id;
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    res.clearCookie("token", { path: "/" });
    res.redirect("/login");
  }
};
