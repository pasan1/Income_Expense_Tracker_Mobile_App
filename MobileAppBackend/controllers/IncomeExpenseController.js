const IncomeExpenseSchema = require("../models/IncomeExpenseSchema");
const bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const getAllData = (req, resp) => {
  const email = req.body.email ? req.body.email : null;

  try {
    if (email !== null) {
      IncomeExpenseSchema.find({ email: email }, (error, result) => {
        if (result) {
          resp.status(200).json({
            message: "success",
            data: result,
            state: true,
          });
        } else {
          resp.status(400).json({ message: "please register.." });
        }
      });
    } else {
      resp
        .status(400)
        .json({ message: "Please provide valid user name and password" });
    }
  } catch (e) {
    resp.status(500).json({ message: "internal Server Error..", error: e });
  }
};

const addTransaction = async (req, resp) => {
  const trans = new IncomeExpenseSchema({
    email: req.body.email,
    description: req.body.description,
    price: req.body.price,
    method: req.body.method,
  });
  trans
    .save()
    .then((savedResponse) => {
      let dataObj = {
        message: "Success.",
        state: true,
      };

      resp.status(200).json({ dataObj });
    })
    .catch((savedResponseError) => {
      resp.status(500).json({
        message: "internal Server Error.",
        state: false,
        error: savedResponseError,
      });
    });
};

const deleteTransaction = (req, resp) => {
  const id = req.body.id ? req.body.id : null;

  try {
    if (id !== null) {
      IncomeExpenseSchema.deleteOne({ _id: id }, (error, result) => {
        if (result) {
          resp.status(200).json({
            message: "success",
            data: result,
            state: true,
          });
        } else {
          resp.status(400).json({ message: "please add.." });
        }
      });
    } else {
      resp.status(400).json({ message: "Invalid ID..." });
    }
  } catch (e) {
    resp.status(500).json({ message: "internal Server Error..", error: e });
  }
};

module.exports = {
  getAllData,
  addTransaction,
  deleteTransaction,
};
