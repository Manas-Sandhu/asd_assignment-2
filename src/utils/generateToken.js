const crypto = require("crypto");
const jwt = require("jsonwebtoken");

function generateToken(user) {
  if (!process.env.JWTSECRET) {
    throw new Error("JWTSECRET is not set. Add it to your .env file.");
  }

  return jwt.sign(
    {
      sub: user.id,
      id: user.id,
      email: user.email,
    },
    process.env.JWTSECRET,
    {
      expiresIn: "1h",
      jwtid: crypto.randomUUID(),
    }
  );
}

module.exports = generateToken;
