const express = require('express');
const path = require('path');
const router = express.Router();

const passport = require('passport');

const mongoSetup = require(path.resolve(__dirname + '/../mongoSetup'))
const ObjectID = require('mongodb').ObjectID

var database
mongoSetup.getDatabase((db) => {database = db});
const MEALS = "meals"

// makes front end meal into meal database with extra info
const makeMealObject = (meal, username) => {
  if(!meal.seats || !(meal.seats > 0)) {
    return null
  }
  return Object.assign(meal,
    {
      chef: username,
      openSeats: meal.seats,
      diners: []
    }
  )
}

/*
Takes in a meal object
must have seats: integer field
returns a meal ID: string
*/

router.post("/addMeal", (req, res, next) => {
  var username = req.root.username
  var meal = makeMealObject(req.body.meal, username)
  if(meal == null) {
    res.json({success: false, data: "Bad meal object - incorrect value for param: seats"})
  } else {
    database.collection(MEALS).insertOne(meal, (err, result) => {
      if(err) {
        res.json({success: false, data: "Meal couldn't be added"})
      }
      else {
        res.json({success: true, data: "Meal uploaded successfully!", mealID: result.insertedId})
      }
    })
  }
})

/*
Takes in a meal_id: string
*/

router.post("/deleteMeal", (req, res, next) => {
  var mealID = new ObjectID(req.body.mealID)
  database.collection(MEALS).removeOne({_id: mealID}, (err, result) => {
    if(err || result.deletedCount <= 0) {
      res.json({success: false, data: "Meal couldn't be deleted"})
    } else {
      res.json({success: true, data: "Meal deleted successfully!"})
    }
  })
})

/*
Takes in a meal_id: string, seatsNumber: integer
*/
router.post("/reserveSeats", (req, res, next) => {
  var seatsNumber = req.seatsNumber;
  var username = req.user.username;
  var mealID = new ObjectID(req.mealID)
  database.collection(MEALS).findOne({_id: mealID}, (err, result) => {
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
