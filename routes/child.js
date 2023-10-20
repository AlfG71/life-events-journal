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

//Check
router.get('/profile/:childId', (req, res, next) => {
  const childId  = req.params.childId
  
  Child.findById(childId)
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

  // res.json(childId)

});



router.post('/edit-child/:childId', (req, res, next) => {
  const { childId } = req.params;

  Child.findByIdAndUpdate( childId, req.body, {new: true })
    .then((foundChild) => {
     const { name, dateOfBirth, img, events } = foundChild 
      
     const child = { name, dateOfBirth, img, events }
     res.status(201).json('child updated')
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