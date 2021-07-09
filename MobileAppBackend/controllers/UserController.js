const UserSchema = require("../models/UserSchema");
const bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const registerUser = async (req, resp) => {
  UserSchema.findOne({ email: req.body.email }, (error, result) => {
    if (error) {
      resp.status(500).json({ message: error });
    } else {
      if (result !== null) {
        // already exists
        let data = {
          message: "email address is exists !",
          state: false,
        };
        resp.status(400).json({ data });
      } else {
        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(req.body.password, salt, function (error, hash) {
            const user = new UserSchema({
              fName: req.body.fName,
              lName: req.body.lName,
              email: req.body.email,
              password: hash,
              userState: req.body.userState,
            });
            user
              .save()
              .then((savedResponse) => {
                const token = jwt.sign(
                  {
                    email: req.body.email,
                    password: req.body.password,
                  },
                  process.env.JWT_AUTH,
                  { expiresIn: "24h" }
                );

                let dataObj = {
                  message: "success",
                  data: savedResponse,
                  token: token,
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
          });
        });
      }
    }
  });
};

const login = (req, resp) => {
  console.log(req);
  const email = req.body.email ? req.body.email : null;
  const password = req.body.password ? req.body.password : null;

  try {
    if (email !== null && password !== null) {
      UserSchema.findOne({ email: email, userState: true }, (error, result) => {
        if (result !== null) {
          bcrypt.compare(
            password,
            result.password,
            function (err, finalOutPut) {
              if (err) {
                resp.status(500).json(err);
              }
              if (finalOutPut) {
                const token = jwt.sign(
                  {
                    email: email,
                    password: password,
                  },
                  process.env.JWT_AUTH,
                  { expiresIn: "24h" }
                );
                resp.status(200).json({
                  message: "success",
                  data: result,
                  token: token,
                  state: true,
                });
              } else {
                resp.status(400).json({ message: "please register.." });
              }
            }
          );
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

module.exports = {
  registerUser,
  login,
};
