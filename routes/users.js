var express = require('express');
var router = express.Router();

const jwt = require("jsonwebtoken");

const User = require('../models/User');

const isAuthenticated = require('../middleware/isAuthenticated');

/* GET users listing. */
router.get('/details/:userId', (req, res, next) => {
  const { userId } = req.params

  User.findById(userId)
    .then((foundUser) => {
      const { userName, email, img, children } = foundUser

      const userInfo = { userName, email, img, children };
      res.json(userInfo)
    })
    .catch((err) => {
      console.log(err)
      res.jason(err)
      next(err)
    })

});

module.exports = router;
