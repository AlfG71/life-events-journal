var express = require('express');
var router = express.Router();

const jwt = require("jsonwebtoken");

const User = require('../models/User');

const isAuthenticated = require('../middleware/isAuthenticated');

/* GET user listing. */
router.get('/profile', isAuthenticated, (req, res, next) => {
  const { _id } = req.user

  User.findById(_id)
    .populate('children')
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
      const {_id, email, img, userName, children } = updatedUser;
      const user = { _id, userName, email, img, children };
      const authToken = jwt.sign(user, process.env.SECRET, {
        algorithm: "HS256",
        expiresIn: "6h",
      })

      console.log("Updated User ===>", user)
      res.json({ user, authToken });

    })
    .catch((err) =>{
      console.log(err);
      res.json(err);
      next(err);
    });
});

router.delete('/delete', (req, res, next) => {
  const { _id } = req.user;

  User.findByIdAndDelete(_id)
    .then((deleted) =>
      res.json({
        deleted,
        message: `User has been removed successfully.`,
      })
    )
    .catch((error) => res.json(error));
});



module.exports = router;
