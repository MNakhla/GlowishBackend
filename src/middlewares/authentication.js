const { customerModel, freelancerModel } = require("../models");
const jwt = require("jsonwebtoken");
const { authConfig } = require("../config");

async function verifySignUp(req, res, next) {
  let model =
    req.body.userType === "freelancer" ? freelancerModel : customerModel;
  const user = await model.findOne({
    email: req.body.email,
  });
  if (user) {
    res.status(400).json({ msg: "user email already in use!" });
  } else {
    next();
  }
}

async function verifyJwt(req, res, next) {
  let jwtToken = req.headers.authorization?.split(" ")[1];
  if (!jwtToken) {
    res.status(400).json({ msg: "auth token not provided!" });
  }
  jwt.verify(jwtToken, authConfig.authSecret, (err, user) => {
    if (err) {
      res.status(401).json({ msg: "token not authorized!" });
    }
    req.userId = user?.id;
    req.userType = user?.type;
    next();
  });
}

async function verifyFreelancer(req, res, next) {
  if (req.userType === "freelancer") {
    if (req.userId?.toString() === req.params._id) {
      next();
    } else {
      res.status(403);
    }
  } else {
    res.status(403);
  }
}

async function verifyCustomer(req, res, next) {
  if (req.userType === "customer") {
    if (req.userId?.toString() === req.params._id) {
      next();
    } else {
      res.status(403);
    }
  } else {
    res.status(403);
  }
}

async function verifyCustomerPost(req, res, next) {
  if (req.userType === "customer") {
    if (req.userId?.toString() === req.body.customer) {
      next();
    } else {
      res.status(403);
    }
  } else {
    res.status(403);
  }
}

module.exports = {
  verifySignUp,
  verifyJwt,
  verifyFreelancer,
  verifyCustomer,
  verifyCustomerPost,
};
