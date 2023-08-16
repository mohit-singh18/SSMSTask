const crypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = {
  signup: async (req, res) => {
    try {
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res
          .status(400)
          .json({ msg: "User with same email already exists!" });
      }
      const password = req.body.password;
      const hashedPassword = await crypt.hash(password, 10);
      let newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        fcmtoken : req.body.fcmtoken
      });
      newUser = await newUser.save();
      res.status(201).json(newUser);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },
  login: async (req, res) => {
    fcmtoken = req.body.fcmtoken;
    try {
      
      const existingUser = await User.findOne({ email: req.body.email });
      if (!existingUser) {
        return res
          .status(400)
          .json({ msg: "User with this email does not Exist!" });
      }
      const isMatch = await crypt.compare(
        req.body.password,
        existingUser.password
      );
      if (!isMatch) {
        return res.status(400).json({ msg: "Incorrect Password" });
      }
      const token = jwt.sign(
        { id: existingUser._id },
        process.env.JWT_AUTH_KEY
      );
      res.json({ token,fcmtoken, ...existingUser._doc });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },
};
