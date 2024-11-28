const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require('jsonwebtoken');

module.exports.registerUser = (req, res) => {
    const { email, password } = req.body;
    if (!email.includes("@")) {
        return res.status(400).send({ message: "Invalid email format" });
    }
    if (password.length < 8) {
        return res.status(400).send({ message: "Password must be at least 8 characters" });
    }
    new User({
        email,
        password: bcrypt.hashSync(password, 10),
    }).save()
        .then(() => res.status(201).send({ message: "Registered Successfully" }))
        .catch(() => res.status(500).send({ error: "Error in saving" }));
};

module.exports.loginUser = (req, res) => {
  const { email, password } = req.body;
  if (!email.includes("@")) {
    return res.status(400).send({ message: "Invalid email format" });
  }
  User.findOne({ email })
    .then((result) => {
      if (result == null) {
        return res.status(404).send({ error: "No email found" });
      } else {
        const isPasswordCorrect = bcrypt.compareSync(
          password,
          result.password
        );
        if (isPasswordCorrect) {
          const accessToken = jwt.sign({ id: result._id }, process.env.JWT_SECRET_KEY, {});
          return res.status(200).send({ access: accessToken });
        } else {
          return res.status(401).send({ message: "Email and password do not match" });
        }
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({ error: "Error in logging in" });
    });
};


module.exports.getUserDetails = (req, res) => {
  User.findById(req.user.id, "email _id")
      .then(user => {
          if (!user) {
              return res.status(404).json({ message: "User not found" });
          }
          return res.status(200).json({
              user: {
                  id: user._id,
                  email: user.email
              } 
          });
      })
      .catch(err => {
          console.error("Error retrieving user details:", err);
          return res.status(500).json({ error: "Failed to retrieve user details" });
      });
};
