const jwt = require("jsonwebtoken");
const config = require("../config/dev");
const joi = require("joi");
const database = require("./database");
const bcrypt = require("bcrypt");

module.exports = {
  login: async function (req, res, next) {
    const reqBody = req.body;

    const schema = joi.object({
      email: joi.string().required().min(6).max(255).email(),
      password: joi.string().required().min(6),
    });

    const { error } = (schema = schema.validate(reqBody));

    if (error) {
      res.status(401).send("please log in first");
      throw error.details[0].message;
    }

    const sql = "SELECT * FROM customers WHERE email=?";
    try {
      const result = await database.query(sql, [reqBody.email]);
      const validPassword = await bcrypt.compare(
        reqBody.password,
        rows[0].password_hash
      );
      if (!validPassword) throw "Password Incorrect, try again";

      const param = { email: reqBody.email };
      const token = jwt.sign(param, config.JWT_SECRET, { expiresIn: "72800s" });
    } catch (err) {
      res.status(401).send("please log in first");
      throw `Error: ${err}`;
    }
  },
};
