const { customerModel, freelancerModel } = require("../models");
const { authConfig } = require("../config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function handleSignup(req, res) {
  const model =
    req.body.userType === "freelancer" ? freelancerModel : customerModel;
  let newUser = new model({
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8), // TODO add salt param
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    notifications: [
      {
        message:
          "Your account has been created successfully! " +
          (req.body.userType === "freelancer"
            ? "Start by completing your profile to receive appointments"
            : "Start booking your first appointment now by searching for your favorite freelancer or by date and location"),
        read: false,
        time: new Date(),
      },
    ],
  });
  newUser.save((err, user) => {
    if (err || !user) {
      res.status(500).json({ msg: err });
    } else {
      res.status(200).json(user);
    }
  });
}

async function handleLogin(req, res) {
  const model =
    req.body.userType === "freelancer" ? freelancerModel : customerModel;
  const user = await model.findOne({
    email: req.body.email,
  });
  if (!user) {
    res.status(404).json({ msg: "email not found!" });
  } else {
    const valid = bcrypt.compareSync(req.body.password, user.password);
    if (!valid) {
      res.status(403).json({ msg: "invalid password!" });
    } else {
      const accessToken = jwt.sign(
        { id: user._id, type: req.body.userType },
        authConfig.authSecret,
        {
          expiresIn: authConfig.expiration,
        }
      );
      res.status(200).json({
        userId: user._id,
        userType: req.body.userType,
        accessToken: accessToken,
      });
    }
  }
}

module.exports = { handleSignup, handleLogin };
