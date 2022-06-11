const jwt = require("jsonwebtoken");
const config = require("../config/dev");

module.exports = (req, res, next) => {
  try {
    req.user = jwt.verify(req.cookies.access_token, config.JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).send(`Access Denied. go to /signin`);
    console.log(err);
  }
};
