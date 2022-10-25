const jwt = require("jsonwebtoken");
require("dotenv").config("./.env");
const { getUserRoles } = require("../controllers/users.controller");

const authenticationMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      throw new Error("Invalid Token");
    }
    const [, bearerToken] = token.split(" ");
    const decrypted = jwt.verify(bearerToken, process.env.JWT_SECRET);

    if (decrypted.expiresIn <= new Date().getTime())
      throw new Error("Token expired");

    req.body.userId = decrypted.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: { message: err.message } });
  }
};

const authorizationMiddleware = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const role = await getUserRoles(userId);

    if (!role.includes("admin")) {
      throw new Error("Unauthorized to perform this action");
    }

    next();
  } catch (err) {
    res.status(401).json({ error: { message: err.message } });
  }
};

module.exports = { authenticationMiddleware, authorizationMiddleware };
