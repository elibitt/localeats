const express = require('express');
const path = require('path');
const router = express.Router();

const mongoSetup = require(path.resolve(__dirname + '/../mongoSetup'))

var database
mongoSetup.getDatabase((db) => {database = db});
const MEALS = "meals"


// makes front end meal into meal database with extra info
const makeMealObject = (meal, host) => {
  return Object.assign(meal,
        {
          open_seats: meal.seats,
          diners: [],
          host: host
        }
  )
}

/*
Takes in a meal object
must have seats: integer field
returns a meal ID: string
*/
const addMeal = (username, meal, next) => {
  database.collection(MEALS).insertOne(makeMealObject(req.meal, username), (err, result) => {
    if(err) {
      next({success: false, data: "Meal couldn't be added"})
    }
    else {
      next({success: true, data: "Meal uploaded successfully!", mealID: result._id })
    }
  })
}

const deleteMeal = (username, mealID, next) => {
  database.collection(MEALS).removeOne({_id: meal_id, host: username}, (err, result) => {
    if(err) {
      next({success: false, data: "Meal couldn't be added"})
    } else {
      next({success: true, data: "Meal deleted successfully!"})
    }
  })
}

const getMyMeals = (username, next) => {
  database.collection(MEALS).find({host: username}, (err, result) => {
    if(err) {
      next({success: false, data: "Meal couldn't be added"})
    } else {
      next({success: true, data: results})
    }
  })
}

const getOpenMeals = (next) => {
  database.collection(MEALS).find({open_seats: {$gt: 0}}, (err, result) => {
    if(err) {
      next({success: false, data: "Meal couldn't be added"})
    } else {
      next({success: true, data: results})
    }
  })
}

module.exports = {
  addMeal,
  deleteMeal,
  getMyMeals,
  getOpenMeals
}
