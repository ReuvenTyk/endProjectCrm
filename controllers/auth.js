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

    const { error } = schema.validate(reqBody);

    if (error) {
      res.status(401).send("please log in first");
      throw error.details[0].message;
    }

    const sql = "SELECT * FROM customers WHERE email=?";

    try {
      const result = await database.query(sql, [reqBody.email]);
      const rows = result[0];
      const validPassword = await bcrypt.compare(
        reqBody.password,
        rows[0].password_hash
      );
      if (!validPassword) throw "Password Incorrect, try again";

      const param = { id: rows[0].id, email: rows[0].email };
      const token = jwt.sign(param, config.JWT_SECRET, {
        expiresIn: "72800s",
      });

      res
        .cookie("access_token", token, {
          httpOnly: true,
          secure: true,
        })
        .send("you are now logged in");
    } catch (err) {
      res.status(401).send("please log in first");
      throw `Error: ${err}`;
    }
  },
};
