const path = require("path");
const database = require("../controllers/database");
const fs = require("fs");

module.exports = {
  getHtmlFilePath: function (htmlFileName) {
    return path.join(__dirname, "../client", htmlFileName);
  },
};
