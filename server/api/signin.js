const express = require('express');
const path = require('path');
const uuidv4 = require('uuid/v4')
const signInRouter = express.Router();

const mongoSetup = require(path.resolve(__dirname + '/../mongoSetup'))
const { hash, compare } = require(path.resolve(__dirname + '/../encrypter'))

const USERS = 'users'
const SESSIONS = 'sessions'

var database
mongoSetup.getDatabase((db) => {database = db});

const isLoggedInMiddleware = (req, res, next) => {
    if(!req.body.sessionID) {
      res.json({success: false, data: "No sessionID was given with the request"})
    } else {
      var sessionID = req.body.sessionID
      database.collection(SESSIONS).findOne({sessionID: sessionID}, (err, result) => {
        if(err) {
          res.json({success: false, data: "An error occurred"})
        }
        else if(result == null) {
          res.json({success: false, data: "Your sessionID could not be verified, please login"})
        }
        else{
          req.root = {username: result.username}
          next()
        }
      })
    }
}

/*
Takes in a username and password
*/
signInRouter.post('/login', (req, res, next) => {
  var username = req.body.username.toLowerCase()
  var password = req.body.password
  database.collection(USERS).findOne({ username: username }, (err, user) => {
    if (err || !user) {
      res.json({success: false, data: "No such username exists"})
    }
    else if (!compare(password, user.password)) {
      res.json({success: false, data: "Incorect password or username"})
    }
    else {
      const newID = uuidv4();
      database.collection(SESSIONS).deleteMany({username: user.username}, (err, nDeleted) => {
        if(err) {
          res.json({success: false, data: "An error occurred"})
        }
        else {
          database.collection(SESSIONS).insertOne({sessionID: newID, username: user.username}, (err, id) => {
            if(err) {
              res.json({success: false, data: "An error occurred"})
            }
            else {
              console.log("SERVER", username, newID)
              res.json({success: true, sessionID: newID})
            }
          })
        }
      })
    }
  })
});

/* works through the logged in middleware */
signInRouter.post('/logout', isLoggedInMiddleware, (req, res, next) => {
    var username = req.root.username
    database.collection(SESSIONS).deleteMany({username: username}, (err, nDeleted) => {

        if(err || nDeleted <= 0) {
          res.json({success: false, data: "User's session ID could not be found"})
        }
        else {
          res.json({success: true, data: "User was logged out"})
        }
    })
})

/* works through the logged in middleware */
signInRouter.post('/getUsername', isLoggedInMiddleware, (req, res, next) => {
    var username = req.root.username
    res.json({success: true, data: username})
})

/*
Takes in a username and password
*/
signInRouter.post('/register', ((req, res, err) => {
  var username = req.body.username.toLowerCase()
  var password = req.body.password
  var usernameExists = false
  database.collection(USERS).findOne({ username: username }, function (err, user) {
    if (user != null) {
      res.json({success: false, data: "Username already exists"})
    }
    else {
      database.collection(USERS).insertOne({ username: username, password: hash(password) },
        function (err, user) {
          if(err) {
              res.json({success: false, data: "An error occurred"})
          } else {
            const newID = uuidv4();
            database.collection(SESSIONS).insertOne({sessionID: newID, username: username}, (err, id) => {
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
}))


module.exports = { signInRouter, isLoggedInMiddleware }
