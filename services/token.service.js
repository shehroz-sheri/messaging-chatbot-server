const jwt = require("jsonwebtoken");
const { tokenMaxAge } = require("../constants/constants");

const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      number: user.number,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: tokenMaxAge }
  );
};

module.exports = generateToken;
