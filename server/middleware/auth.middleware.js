const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');


const AuthMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError("Invalid Authorization")
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_ACC_SECRET);
    const { userId } = payload;
    req.user = { userId };
    next();
  } catch (error) {
    throw new UnauthenticatedError('Invalid Authentication.');
  }
}

module.exports = AuthMiddleware;