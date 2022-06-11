const express = require("express");
const router = express.Router();
const cm = require("../controllers/customers");
const auth = require("../controllers/auth");
const mwAuth = require("../middleware/auth");
const fileMgmt = require("../shared/fileMgmt");

router.get("/home", function (req, res, next) {
  const filePath = fileMgmt.getHtmlFilePath("customers-home.html");
  res.sendFile(filePath);
});

router.get("/page", mwAuth, function (req, res, next) {
  const filePath = fileMgmt.getHtmlFilePath("customer-page.html");
  res.sendFile(filePath);
});

router.post("/", cm.addCustomer);
router.get("/details", mwAuth, cm.getCustomer);
router.post("/addCard", mwAuth, cm.addCard);

module.exports = router;
