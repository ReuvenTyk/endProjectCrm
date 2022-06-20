const express = require("express");
const router = express.Router();
const cam = require("../controllers/cards");
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

router.get("/", mwAuth, cam.getCard);
router.get("/export", mwAuth, cam.getAllCards);
router.post("/", mwAuth, cam.addCard);
router.delete("/:id", mwAuth, cam.deleteCard);
router.put("/:id", mwAuth, cam.updateCard);

module.exports = router;
