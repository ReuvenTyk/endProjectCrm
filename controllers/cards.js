const joi = require("joi");
const bcrypt = require("bcrypt");
const database = require("./database");
const auth = require("./auth");

module.exports = {
  addCard: async function (req, res, next) {
    const reqBody = req.body;
    const id = req.user.id;

    const schema = joi.object({
      business_name: joi.string().required().min(2).max(100),
      description: joi.string().required().min(2).max(500),
      address: joi.string().required().min(2).max(100),
      phone: joi
        .string()
        .required()
        .regex(/^[0-9]\d{8,11}$/),
      image: joi.string().allow(""),
    });

    const { error } = schema.validate(reqBody);

    if (error) {
      res.status(400).send(`error adding card: ${error}`);
      throw error;
    }

    const sql =
      "INSERT INTO client_business_card(customer_id, business_name, description, address, phone, image)" +
      "VALUES(?,?,?,?,?,?)";

    try {
      const result = await database.query(sql, [
        id,
        reqBody.business_name,
        reqBody.description,
        reqBody.address,
        reqBody.phone,
        reqBody.image,
      ]);
      res.status(200).send(`the new business ${result[0]} added`);
    } catch (err) {
      throw err;
    }
  },

  getAllCards: async function (req, res, next) {
    const id = req.user.id;
    const sql = `SELECT id, business_name, description, address, phone image FROM client_business_card WHERE customer_id=${id} ORDER BY id ASC`;
    try {
      //going to mySql2 promise func
      const result = await database.query(sql);
      res.send(result[0]);
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  },

  getCard: async function (req, res, next) {
    const param = req.query;
    console.log(param);

    const schema = joi.object({
      card: joi.number().required(),
    });

    const { error } = schema.validate(param);

    if (error) {
      res.status(400).send(`error adding card: ${error}`);
      throw error;
    }
    const sql = `SELECT business_name,description,address,phone,image FROM client_business_card WHERE id=${param.card};`;

    try {
      const result = await database.query(sql);
      res.send(result[0]);
    } catch (err) {
      res.status(400).send(`search is Invalid: ${err}`);
      throw err;
    }
  },

  deleteCard: async function (req, res, next) {
    const schema = joi.object({
      id: joi.number().required(),
    });

    const { error, value } = schema.validate(req.params);

    if (error) {
      res.status(400).send(`error deleting card: ${error}`);
      throw error;
    }

    const sql = "DELETE FROM client_business_card WHERE id=?";

    try {
      const result = await database.query(sql, [value.id]);
      console.log(`the card got deleted: ${value.id}`);
    } catch (err) {
      res.status(400).send(`search is Invalid: ${err}`);
      throw err;
    }
  },
};
