var express = require('express');
var router = express.Router();

const jwt = require("jsonwebtoken");

const Child = require('../models/Child');
const LifeEvent = require('../models/LifeEvent');
const isAuthenticated = require('../middleware/isAuthenticated');
const User = require('../models/User');

// Create an event
router.post('/create/:childId', isAuthenticated, (req, res, next) => {
  const { childId } = req.params;
  const { _id }  = req.user;

  const { eventTitle, date, description, img } = req.body;

  console.log(childId)

  LifeEvent.create({
      child: childId,
      eventTitle,
      date,
      description,
      img: img || undefined,
    })
    .then((newEvent) => {
     return Child.findByIdAndUpdate(childId, {
        $push: {events: newEvent._id}
      })
    })
    .then((child) => {
      return  User.findById(_id)
      .populate({
        path: 'children',
        populate: {path: 'events'}
      })
    })
    .then((user) => {
      const authToken = jwt.sign(user.toJSON(), process.env.SECRET, {
        algorithm: 'HS256',
        expiresIn: '6h',
      });
      res.status(201).json({user, msg: "Event created", authToken})
    })
    .catch((err) => {
    console.log(err);
    res.json(err);
    next(err);
    })
})

// See all events
router.get('/all/:childId', (req, res, next) => {
  const { childId } = req.params;

  Child.findById(childId)
    .populate("events")
    .then((child) => {
      const { events } = child;
      res.json(events);
    })
    .catch((err) => {
    console.log(err);
    res.json(err);
    next(err);
    })
})

//  See one event
router.get('/event/:childId/:eventId', (req, res, next) => {
  const { childId, eventId } = req.params;

  Child.findById(childId)
    .populate('children')
    .then(() => {
      LifeEvent.findById(eventId)
        .then((foundEvent) => {
          console.log("foudn Event ===>", foundEvent)
          const { date, description, img } = foundEvent;
          const eventInfo = { date, description, img };
          console.log("Response Info ===> ", res)
          res.json(eventInfo)
        })
        .catch((err) => {
          console.log(err);
          res.json(err);
          next(err);
        })
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
      next(err);
    })
})


// edit an event
router.post('/edit/:childId/:eventId', isAuthenticated, async (req, res, next) => {
  const { childId, eventId } = req.params;

  try {

    const foundEvent = await LifeEvent.findByIdAndUpdate(eventId, req.body, { new: true });

    const updatedChild = await Child.findById(childId).populate('events');

    const updatedUser = await User.findById(req.user._id).populate('children');

    const authToken = jwt.sign(updatedUser.toJSON(), process.env.SECRET, {
      algorithm: 'HS256',
      expiresIn: '6h',
    });

    res.status(202).json({ user: updatedUser, authToken, event: foundEvent });
  } catch (err) {
    console.log(err);
    res.json({ error: 'Something went wrong' });
    next(err);
  }
});


// router.post('/edit/:childId/:eventId', isAuthenticated, (req, res, next) => {
//   const { childId, eventId } = req.params;

//   LifeEvent.findByIdAndUpdate(eventId, req.body, { new: true })
//     .then((foundEvent) => {
//       const { date, description, img } = foundEvent;
//       const event = { date, description, img };

//       Child.findById(childId)
//         .populate('events')
//         .then((updatedChild) => {
//           const { _id, name, dateOfBirth, img, events } = updatedChild;

//           const child = { _id, name, dateOfBirth, img, events };

//           User.findById(req.user._id)
//             .populate('children')
//             .then((updatedUser) => {
//               const { _id, userName, img, email, children } = updatedUser;
//               const user = { _id, userName, img, email, children };

//               const authToken = jwt.sign(user, process.env.SECRET, {
//                 algorithm: 'HS256',
//                 expiresIn: '6h',
//               });

//               res.status(202).json({ user, authToken, event: foundEvent });
//             })
//             .catch((err) => {
//               console.log(err);
//               res.json({ error: 'Something went wrong' });
//               next(err);
//             });
//         })
//         .catch((err) => {
//           console.log(err);
//           res.json(err);
//           next(err);
//         });
//     })
//     .catch((err) => {
//       console.log(err);
//       res.json(err);
//       next(err);
//     });
// });

// delete event

router.delete('/delete/:childId/:eventId', isAuthenticated, async (req, res, next) => {
  const { childId, eventId } = req.params;

  try {
    const deletedLifeEvent = await LifeEvent.findByIdAndDelete(eventId);

    const removedInChild = await Child.findByIdAndUpdate(
      childId,
      {
        $pull: { events: eventId },
      },
      { new: true }
    )
      .then((updatedChild) => {
        User.findById(req.user._id)
          .populate({
            path: 'children',
            populate: {path: 'events'}
        })
          .then((updatedUser) => {
            const authToken = jwt.sign(updatedUser.toJSON(), process.env.SECRET, {
              algorithm: "HS256",
              expiresIn: "6h",
            });
            res
              .status(202)
              .json({ user: updatedUser, authToken });
          })
          .catch((err) => {
            console.log(err);
            res.json(err);
            next(err);
          });
      })
      .catch((err) => {
        console.log(err);
        res.json(err);
        next(err);
      });
  } catch (err) {
    console.error(err);
    res.json(err);
    next(err);
  }
})

module.exports = router;