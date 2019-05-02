const express = require('express');
const path = require('path');
const router = express.Router();

const mongoSetup = require(path.resolve(__dirname + '/../mongoSetup'))

var database
mongoSetup.getDatabase((db) => {database = db});
const INFO = "userInfo"

router.post("/setInfo", (req, res, next) => {
  var username = req.root.username;
  var info = req.body.info;
  database.collection(INFO).updateOne({username: username},  {$set: {"info": info}}, {upsert: true}, (err, result) => {
    if(err) {
      console.log(err)
      res.json({success: false, data: "Couldn't store user info - a database error occurred"})
    } else {
      res.json({success: true, data: "User info was inserted"})
    }
  })
})


router.post("/getInfo", (req, res, next) => {
  // NOT from the sessionID, this is for getting others' info
  var username = req.body.username;
  database.collection(INFO).findOne({username: username}, (err, result) => {
      if(err) {
        console.log(err)
        res.json({success: false, data: "Couldn't find user info - a database error occurred"})
      } else if (!result) {
        res.json({success: false, data: "No entry with that username was found in the database"})
      } else {
        res.json({success: true, data: result})
      }
    })
})

module.exports = router
