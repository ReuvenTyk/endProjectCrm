const joi = require("joi");
const bcrypt = require("bcrypt");
const database = require("./database");
const fileMgmt = require("../shared/fileMgmt");

module.exports = {
  addCustomer: async function (req, res, next) {
    //get data from HTML
    const reqBody = req.body;

    //Validation
    const schema = joi.object({
      name: joi.string().required().min(2).max(50),
      email: joi
        .string()
        .required()
        .regex(/^[^@]+@[^@]+$/),
      password: joi.string().required().min(6).max(200),
      client_type: joi.required(),
    });

    //Validation error
    const { error } = schema.validate(reqBody);

    if (error) {
      res.status(400).send(`add failed: ${error}`);
      return;
    }

    //bcypt password
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const password_hash = bcrypt.hashSync(reqBody.password, salt);

    //Validation succeed--> add to DB
    const sql =
      "INSERT INTO customers(name,email,password_hash,client_type)" +
      "VALUES(?,?,?,?)";

    try {
      const result = await database.query(sql, [
        reqBody.name,
        reqBody.email,
        password_hash,
        reqBody.client_type,
      ]);
    } catch (err) {
      throw err;
    }
    res.status(200).send(`${reqBody.name} added successfully`);
  },
};
