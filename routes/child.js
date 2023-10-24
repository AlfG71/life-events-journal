var express = require("express");
var router = express.Router();

const jwt = require("jsonwebtoken");
const Child = require("../models/Child");
const User = require("../models/User");
const isAuthenticated = require("../middleware/isAuthenticated");

router.post("/create", isAuthenticated, (req, res, next) => {
  Child.create(req.body)    // no debe ir const { _id } = req.user
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
    .then((updatedUser) => {
      const { _id, userName, img, email, children } = updatedUser;
      const user = { _id, userName, img, email, children };
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

//Check
router.get('/profile/:childId', (req, res, next) => {
  const childId  = req.params.childId

  Child.findById(childId)
    .populate('user')
    .then((foundChild) => {
      const { name, dateOfBirth, img, events } = foundChild

      const childInfo = { name, dateOfBirth, img, events };
      res.json(childInfo)
    })
    .catch((err) => {
      console.log(err);
      res.json(err)
      next(err)
    })
});



router.post('/edit-child/:childId', isAuthenticated, (req, res, next) => {
  const { childId } = req.params;

  console.log("Child ===>", childId, req.body)

  Child.findByIdAndUpdate( childId, req.body, {new: true })
    .then((foundChild) => {
      console.log("Updated Child===>", foundChild)
      // const { name, dateOfBirth, img, events } = foundChild

      // const child = { name, dateOfBirth, img, events }

        User.findById(req.user._id)
          .populate('children')
          .then((updatedUser) => {

            const { _id, userName, img, email, children } = updatedUser

            const user = { _id, userName, img, email, children }

            const authToken = jwt.sign(user, process.env.SECRET, { // added to create persistence
             algorithm: "HS256",
             expiresIn: "6h",
           });

            res.status(201).json({ user, authToken })
          })
          .catch(err => {
            console.log(err);
            res.json({ error: 'Something went wrong' });
            next(err);
          });
    })
    .catch(err => {
      console.log(err);
      res.json({ error: 'Something went wrong' });
      next(err);
    });
});



router.delete('/delete/:childId', (req, res, next) => {
  const { childId } = req.params;

  Child.findByIdAndDelete(childId)
    .then((deleted) =>
      res.json({
        deleted,
        message: `Child with ${childId} is removed successfully.`,
      })
    )
    .catch((error) => res.json(error));
});




module.exports = router;