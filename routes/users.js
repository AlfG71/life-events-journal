var express = require('express');
var router = express.Router();

const jwt = require("jsonwebtoken");

const User = require('../models/User');

const isAuthenticated = require('../middleware/isAuthenticated');

/* GET user listing. */
router.get('/profile', isAuthenticated, (req, res, next) => {
  const { _id } = req.user

  User.findById(_id)
    .then((foundUser) => {
      const { userName, email, img, children } = foundUser

      const userInfo = { userName, email, img, children };
      res.json(userInfo)
    })
    .catch((err) => {
      console.log(err);
      res.json(err)
      next(err)
    })

});


//Check

router.post('/update', isAuthenticated, (req, res, next) =>{
  const{ _id } = req.user;

  User.findByIdAndUpdate(_id, req.body, { new: true })
    .then((updatedUser) => {
      // if (!updatedUser) {
      //   return res.status(404).json({})
      // }

      const { userName, email, img, children } = updatedUser;
      const user = { userName, email, img, children };

      res.json(user);
    })
    .catch((err) =>{
      console.log(err);
      res.json(err);
      next(err);
    });
});



module.exports = router;
