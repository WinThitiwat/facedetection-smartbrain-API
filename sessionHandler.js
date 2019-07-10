
const jwt = require('jsonwebtoken');
const redisClient = require('./redisHandler');


const signToken = (email) => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, 'JWT_SECRET', {expiresIn: '2 days'});
}

const setToken = (key, value) => {
  return Promise.resolve(redisClient.set(key, value))
}

// Create JWT token, return user data
const createSessions = (user) => {
  const {email, id} = user;
  const token = signToken(email);
  return setToken(token, id)
    .then(() => {
      return {success: 'true', userId: id, token: token}
    })
    .catch(console.log)
}

const getAuthTokenId = (req, res) => {
  const { authorization } = req.headers;
  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply){
      return res.status(400).json("Unauthorized");
    }
    return res.json({id: reply});
  })
}

module.exports = {
  signToken,
  setToken,
  createSessions,
  getAuthTokenId
}




// export default sessionHandler;