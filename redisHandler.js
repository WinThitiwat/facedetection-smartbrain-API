const redis = require('redis');

module.exports = redis.createClient(process.env.REDIS_URL);

// setup Redis
// const redisClient = redis.createClient(process.env.REDIS_URL);

// export const redisClient = redis.createClient(process.env.REDIS_URL);
