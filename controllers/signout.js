const sessionHandler = require('../sessionHandler');

const handleSignout = (req, res) => {
  const {Authorization} = req.body;
  console.log(Authorization)
  if (Authorization ){
    return sessionHandler.deleteCurrentUserSession(Authorization) 
          .then(resp => {
            console.log(resp)
            res.json(resp)
          })
          .catch(err => res.status(400).json(err))
  } 
  res.status(400).json("Unauthorized")

        
        // Promise.reject("Unable to signout")
}


// const signoutAuthen = () => {
//   const {authorization} = req.headers;
//   return authorization ? sessionHandler.getAuthTokenId(req, res) : 
//     handleSignin(req, res, db, bcrypt)
//       .then(data => {
//         return data.id && data.email ? sessionHandler.createSessions(data) : Promise.reject(data)
//       })
//       .then(session => res.json(session))
//       .catch(err => res.status(400).json(err))

// }

module.exports = {
  handleSignout: handleSignout
}