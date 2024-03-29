const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//register
router.post("/register", async (req, res) => {
  try {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      lat: req.body.lat,
      long: req.body.long,
    });

    //save user and send response
    const user = await newUser.save();
    res.status(200).json(user._id);
  } catch (err) {
    res.status(500).json(err);
  }
});

//login
router.post("/signin", async (req, res) => {
  try {
    //find user
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      res.status(400).json("Wrong username or password!");
    }

    //validate password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      res.status(400).json("Wrong username or password!");
    }

    //send res
    res
      .status(200)
      .json({
        _id: user._id,
        username: user.username,
        lat: user.lat,
        long: user.long,
      });
  } catch (err) {
    res.status(500).json();
  }
});

module.exports = router;
