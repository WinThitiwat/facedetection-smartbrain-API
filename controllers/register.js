const sessionHandler = require('../sessionHandler');

const handleRegister = ((req, res, db, bcrypt) => {
  const {email, name, password} = req.body;

  if (!email || !name || !password){
    return Promise.reject('Incorrect form submission');
  }

  const saltRounds = 10;
  var hash = bcrypt.hashSync(password, saltRounds);

  db.transaction(trx => {
    trx.insert({
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
          res.json(user[0]);
        })
    })
    .then(trx.commit)
    .catch(trx.rollback);
  })
  .catch(err => {
    Promise.reject("Unable to register")
  })
})

const registerAuthentication = (req, res, db, bcrypt) =>{
  const {authorization} = req.headers;
  return authorization ? sessionHandler.getAuthTokenId(req, res) : 
    handleRegister(req, res, db, bcrypt)
      .then(data => {
        return data.id && data.email ? sessionHandler.createSessions(data) : Promise.reject(data)
      })
      .then(session => res.json(session))
      .catch(err => res.status(400).json(err))

}

module.exports = {
  registerAuthentication: registerAuthentication
}