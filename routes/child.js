var express = require("express");
var router = express.Router();

const jwt = require("jsonwebtoken");
const Child = require("../models/Child");
const User = require("../models/User");
const isAuthenticated = require("../middleware/isAuthenticated");

router.post("/create", isAuthenticated, (req, res, next) => {
  Child.create(req.body)
    .then((createdChild) => {
      return User.findByIdAndUpdate(
        req.user._id,
        { $push: { children: createdChild._id } },
        { new: true }
      );
    })
    .then((toPopulate) => {
      return toPopulate.populate("children");
    })
    .then((userNewChild) => {
      const { _id, name, img, dateOfBirth } = userNewChild;
      const user = { _id, name, img, dateOfBirth };
      const authToken = jwt.sign(user, process.env.SECRET, {
        algorithm: "HS256",
        expiresIn: "6h",
      });

      res.json({ user, authToken });
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
      next(err);
    });
});

module.exports = router;