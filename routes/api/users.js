const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator/check");
const config = require("config");
const keys = config.get("SECRETKEYS");
// @route GET api/users
// @des test route

// @access Public

router.get("/", (req, res) => res.send("User Route"));

router.post(
  "/register",
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      } else {
        const avatar = gravatar.url(email, {
          s: "200",
          r: "pg",
          d: "mm"
        });
        user = new User({
          name,
          email,
          password,
          avatar
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user
          .save()
          .then(user => res.json(user))
          .catch(err => console.log(err));
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route GET api/users/login
// @desc login User / returning JWT Token
// @acces public

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  //   Find user by email

  User.findOne({ email }).then(user => {
    // check for user

    if (!user) {
      return res.status(404).send("User not found");
    }

    // check password

    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // user Matched

        const payload = { id: user.id, name: user.name, avatar: user.avatar }; //create jwt

        // sign Token
        jwt.sign(payload, keys, { expiresIn: 3600 }, (err, token) => {
          res.json({
            success: true,
            token: "Bearer " + token
          });
        });
      } else {
        return res.status(400).send("Password incorrect");
      }
    });
  });
});

module.exports = router;
