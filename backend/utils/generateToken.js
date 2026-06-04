const jwt = require("jsonwebtoken");

const generateToken  = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "5m",
  });
};

module.exports = generateToken ;