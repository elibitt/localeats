const express = require('express');
const path = require('path');
const uuidv4 = require('uuid/v4')
const signInRouter = express.Router();

const mongoSetup = require(path.resolve(__dirname + '/../mongoSetup'))
const { hash, compare } = require(path.resolve(__dirname + '/../encrypter'))

const USERS_COLLECTION = 'users'
const SESSIONS_COLLECTION = 'sessions'

var database
mongoSetup.getDatabase((db) => {database = db});

const isLoggedInMiddleware = (req, res, next) => {
    db.collection(SESSIONS).findOne({sessionID: req.sessionID}, (err, result) => {
      if(err) {
        res.json({success: false, data: "An error occurred"})
      }
      else {
        req.root = {username: result.username}
        next()
      }
    })
}

signInRouter.post('/login', (req, res, next) => {
  db.collection(USERS_COLLECTION).findOne({ username: req.username }, (err, user) => {
    if (err || !user) {
      res.json({success: false, data: "Incorect password or username"})
    }
    else if (!compare(password, user.password)) {
      res.json({success: false, data: "Incorect password or username"})
    }
    else {
      const newID = uuidv4();
      db.collection(SESSIONS_COLLECTION).deleteMany({username: user.username}, (err, nDeleted) => {
        if(err) {
          res.json({success: false, data: "An error occurred"})
        }
        else {
          db.collection(SESSIONS_COLLECTION).insertOne({sessionID: newID, username: user.username}, (err, id) => {
            if(err) {
              res.json({success: false, data: "An error occurred"})
            }
            else {
              res.json({success: true, sessionID: newID})
            }
          })
        }
      })
    }
  })
});

signInRouter.post('/register', ((req, res, err) => {
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
          res.json({success: true, data: "New profile created, please log in"})
        })
      }
    })
}))


module.exports = { signInRouter, isLoggedInMiddleware }
