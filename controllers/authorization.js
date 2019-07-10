const redisClient = require('../redisHandler');

// const redisClient = require('./signin').redisClient;

// middleware - to check if there is unauthorized users attempting to access server
const requireAuth = (req, res, next) => {
  const {authorization} = req.headers;
  if (!authorization) {
    return res.status(401).json("Unauthorized");
  }
  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(401).json("Unauthorized")
    }
    console.log("You shall pass")
    return next()
  })
}

module.exports={
  requireAuth: requireAuth
}