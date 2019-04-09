const express = require('express');
const path = require('path');
const router = express.Router();

const passport = require('passport');

const mongoSetup = require(path.resolve(__dirname + '/../mongoSetup'))

var database
mongoSetup.getDatabase((db) => {database = db});
const MEALS = "meals"

// makes front end meal into meal database with extra info
const makeMealObject = (meal) => {
  return Object.assign(meal,
        {
          openSeats: meal.seats,
          diners: []
        }
  )
}

router.post("/addMeal", (req, res, next) => {
  console.log(res.user)
  database.collection(MEALS).insertOne(makeMealObject(req.meal), (err, result) => {
    if(err) {
      res.json({success: false, data: "Meal couldn't be added"})
    }
    else {
      res.json({success: true, data: "Meal uploaded successfully!"})
    }
  })
})

router.post("/deleteMeal", (req, res, next) => {
  database.collection(MEALS).removeOne({_id: req.meal_id}, (err, result) => {
    if(err) {
      res.json({success: false, data: "Meal couldn't be added"})
    } else {
      res.json({success: true, data: "Meal deleted successfully!"})
    }
  })
})

router.post("/reserveSeats", (req, res, next) => {
  var seatsNumber = req.seatsNumber;
  var username = req.user.username;
  database.collection(MEALS).findOne({_id: req.meal_id}, (err, result) => {
    if(err) {
      res.json({success: false, data: "Meal couldn't be found"})
    } else {
      if(result.openSeats >= seatsNumber) {
        var updatedMeal = Object.assign(result,
          {
            openSeats: result.openSeats - seatsNumber,
            diners: result.diners.concat([username, seatsNumber])
          })
        database.collection(MEALS).updateOne({_id: req.meal_id}, {updatedMeal}, (err, result) => {
          if(err) {
            res.json({success: false, data: "Couldn't update with your request"})
          } else {
            res.json({success: true, data: "Your seats have been reserved"})
          }
        })
      } else {
        res.json({success: false, data: "Not enough open seats"})
      }
    }
  })
})


module.exports = router
