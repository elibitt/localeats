const express = require('express');
const router = express.Router();
const path = require('path');
const passport = require('passport');

const mongoSetup = require(path.resolve(__dirname + '/../mongoSetup'))
const { hash, compare } = require(path.resolve(__dirname + '/../encrypter'))

const hash = (password) => {
  const hashed = bcrypt.hashSync(password, 10)
  console.log(hashed)
  return hashed
var database
mongoSetup.getDatabase((db) => {database = db});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login'); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.json({success: true})
    });
  })(req, res, next);
});)

router.post('/register', ((req, res, err) => {
  var username = req.body.username.toLowerCase()
  var password = req.body.password
  var usernameExists = false
  db.collection('users').findOne({ username: username }, function (err, user) {
    if (user != null) {
      res.json({success: false, data: "Username already exists"})
    }
    else {
      db.collection('users').insertOne({ username: username, password: hash(password) },
        function (err, user) {
          res.json({success: true, data: "New profile created"})
        })
      }
    })
}))

module.exports = router
