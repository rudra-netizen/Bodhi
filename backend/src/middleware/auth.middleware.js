const jwt = require("jsonwebtoken");

const userModel = require("../models/user.model");

async function AuthMiddlew(req, res, next) {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized User",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await userModel.findOne({
      _id: decoded.id,
    });

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "User Unauthorized",
    });
  }
}

module.exports = {
  AuthMiddlew,
};

/*
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

async function AuthMiddlew(req, res, next) {
  const { token } = req.cookies;

  if (!token) return res.status(401).json({ message: "Unauthorized User" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await userModel.findOne({
      _id: decoded.id,
    });

    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json({ message: "User Unauthorized" });
  }
}

module.exports = { AuthMiddlew };
*/
