const sessionHandler = require('../sessionHandler');


// const handleRegister = async function(req, res, db, bcrypt) {
//   const {email, name, password} = req.body;

//   if (!email || !name || !password){
//     return Promise.reject('Incorrect form submission');
//   }

//   const saltRounds = 10;
//   var hash = bcrypt.hashSync(password, saltRounds);
//   console.log("promisify")
//   try{

//       // const trx =  await db.transaction();
//       console.log("run async")
//       console.log("insert hash")
//       // const loginEmail = trx('login')
//       //     .returning('email')
//       //     .insert({
//       //       hash: hash,
//       //       email: email
//       //     })

//       const loginEmail = await db.transaction(async function(trx){
//         trx('login')
//         .insert({
//           hash: hash,
//           email: email
//         })
//         .returning('email')
//       })

//       console.log(loginEmail)






//         // return loginEmail
//       console.log("insert user")
//       console.log(loginEmail)
//       const user = trx('users')
//         .returning('*')
//         .insert({
//           email: loginEmail[0],
//           name: name,
//           joined: new Date()
//         })
//           // })

//     // })
//       trx.commit()
//       console.log("commit")
//       console.log(user[0])
//       return user[0]

//   } catch (err) {
//     console.log("err")
//     trx.rollback()
//   }
// }

 // const trx = db.transaction();
  // try{
    // const userInfo = await  trx.insert({
    //                         hash: hash,
    //                         email: email
    //                       })
    //                       .into('login')
    //                       .returning('email')



const handleRegister = (req, res, db, bcrypt) => {
  const {email, name, password} = req.body;

  if (!email || !name || !password){
    return Promise.reject('Incorrect form submission');
  }

  const saltRounds = 10;
  var hash = bcrypt.hashSync(password, saltRounds);
  console.log("transaction")
  return db.transaction(function(trx) {
    //  db('login')
    // .transacting(trx)
    trx
    .insert({
      hash: hash,
      email: email
      })
    .into('login')
    .returning('email')
    .then(loginEmail => {
      return trx('users')
        .returning('*')
        .insert({
          email: loginEmail[0],
          name: name,
          joined: new Date()
        })
        .then(user => {
          return user[0]
        })
    })
    .then(trx.commit)
    .catch(trx.rollback);
  })
  .catch(err => Promise.reject("Unable to register"))
}

const registerAuthentication = (req, res, db, bcrypt) =>{

  const {authorization} = req.headers;

  return handleRegister(req, res, db, bcrypt)
        .then(data=>{
          return data.id && data.email ? sessionHandler.createSessions(data) : Promise.reject(data)
        }).then(session => {
          res.json(session)
        })
        .catch(err => res.status(400).json(err))
  

  // return handleRegister(req, res, db, bcrypt)
  //     .then(data => {
  //       console.log(data)
  //       // return data.id && data.email ? sessionHandler.createSessions(data) : Promise.reject(data)
  //     })
  //     // .then(session => res.json(session))
  //     .catch(err => res.status(400).json(err))

}

module.exports = {
  registerAuthentication: registerAuthentication
}