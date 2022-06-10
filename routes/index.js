const express = require("express");
const router = express.Router();
const auth = require("../controllers/auth");
const fileMgmt = require("../shared/fileMgmt");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send(`This is our home page. go to /customer/home <br>
  To log in go to /login`);
});

router.get("/login", function (req, res, next) {
  const filePath = fileMgmt.getHtmlFilePath("login.html");
  res.sendFile(filePath);
});

router.post("/login", auth.login);

module.exports = router;
