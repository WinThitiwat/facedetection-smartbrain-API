const redis = require('redis');
// setup Redis
module.exports = redis.createClient(process.env.REDIS_URL);


// const redisClient = redis.createClient(process.env.REDIS_URL);

// export const redisClient = redis.createClient(process.env.REDIS_URL);
