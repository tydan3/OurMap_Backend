const router = require("express").Router();
const Pin = require("../models/Pin");

// create a pin
router.post("/", async (req, res) => {
  const newPin = new Pin(req.body);
  try {
    const savedPin = await newPin.save();
    res.status(200).json(savedPin);
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete a pin
router.delete("/", async (req, res) => {
  // save pin to be deleted to pass as response
  // for updating map
  const deletedPin = await Pin.findOne({ _id: req.body._id });
  if (!deletedPin) {
    res.status(400).json("Cannot find pin!");
  }

  // remove pin
  Pin.findByIdAndRemove(req.body._id)
    .exec()
    .then((doc) => {
      if (!doc) {
        return res.status(500).end();
      }
      return res.status(200).json(deletedPin);
    })
    .catch((err) => next(err));
});

// get all pins
router.get("/", async (req, res) => {
  try {
    const pins = await Pin.find();
    res.status(200).json(pins);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
