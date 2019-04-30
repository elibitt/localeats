const express = require('express');
const path = require('path');
const router = express.Router();

const reservationLogic = require('./reservationLogic')
const mongoSetup = require(path.resolve(__dirname + '/../../mongoSetup'))
const ObjectID = require('mongodb').ObjectID

var database
mongoSetup.getDatabase((db) => {database = db});
const MEALS = "meals"


// makes front end meal into meal database with extra info
const makeMealObject = (meal, hostName) => {
  if(!meal.seats || !(meal.seats > 0)) {
    return null
  }
  return Object.assign(meal,
    {
      host: hostName,
      openSeats: meal.seats,
      diners: []
    }
  )
}

const getMeals = (mealIDs, next) => {
    database.collection(MEALS).find({_id: {$in: mealIDs.map((id) => ObjectID(id))}}, (err, result) => {
      if(err) {
        console.log(err)
        next({})
      } else {
        next(result)
      }
    })
}

/*
Takes in a meal object
must have seats: integer field
returns a meal ID: string
*/
const addMeal = (username, meal, next) => {
  var meal = makeMealObject(meal, username)
  if(meal == null) {
    next({success: false, data: "Bad meal object - incorrect value for param: seats"})
  } else {
    database.collection(MEALS).insertOne(meal, (err, result) => {
      if(err) {
        console.log(err)
        next({success: false, data: "Meal couldn't be added - a database error occurred"})
      }
      else {
        next({success: true, data: "Meal uploaded successfully!", mealID: result.insertedId })
      }
    })
  }
}

const deleteMeal = (username, mealID, next) => {
  database.collection(MEALS).removeOne({_id: ObjectID(mealID), host: username}, (err, result) => {
    if(err) {
      console.log(err)
      next({success: false, data: "Meal couldn't be deleted - a database error occurred"})
    } else if (result.deletedCount <= 0){
      next({success: false, data: "Meal couldn't be deleted - deletedCount = 0 "})
    } else {
      next({success: true, data: "Meal deleted successfully!"})
    }
  })
}

const getMyMeals = (username, next) => {
  database.collection(MEALS).find({host: username}).toArray((err, result) => {
    if(err) {
      console.log(err)
      next({success: false, data: "Meal couldn't be retrieved - a database error occurred"})
    } else {
      next({success: true, data: result})
    }
  })
}

const getOpenMeals = (next) => {
  database.collection(MEALS).find({openSeats: {$gt: 0}}, (err, result) => {
    if(err) {
      console.log(err)
      next({success: false, data: "Meals couldn't be retrieved - a database error occurred"})
    } else {
      next({success: true, data: result})
    }
  })
}

const reserveSeats = (mealID, reserver, seatsNumber, next) => {
  database.collection(MEALS).findOne({_id: ObjectID(mealID)}, (err, result) => {
    if(err) {
      next({success: false, data: "Meal to reserve couldn't be found - a database error occurred"})
    } else {
      if(result.openSeats >= seatsNumber) {
        var updatedMeal = Object.assign(result,
          {
            openSeats: result.openSeats - seatsNumber,
            diners: result.diners.concat([username, seatsNumber])
          })
        database.collection(MEALS).updateOne({_id: ObjectID(meal_id)}, {updatedMeal}, (err, result) => {
          if(err) {
            next({success: false, data: "Couldn't update with your request"})
          } else {
            reservationLogic.addReservation(mealID, reserver, seatsNumber, next)
          }
        })
      } else {
        next({success: false, data: "Not enough open seats"})
      }
    }
  })
}

const unreserveSeats = (mealID, reserver, seatsNumber, next) => {
  database.collection(MEALS).findOne({_id: ObjectID(mealID)}, (err, result) => {
    if(err) {
      console.log(err)
      next({success: false, data: "Meal to reserve couldn't be found - a database error occurred"})
    } else {
      if(diners.includes({diner:reserver, seatsReserved: seatsNumber})) {
        var updatedMeal = Object.assign(result,
          {
            openSeats: result.openSeats + seatsNumber,
            diners: result.diners.filter(x => x.diner != reserver)
          })
        database.collection(MEALS).updateOne({_id: ObjectID(meal_id)}, {updatedMeal}, (err, result) => {
          if(err) {
            console.log(err)
            next({success: false, data: "Couldn't update with your request - a database error occurred"})
          } else {
            reservationLogic.deleteReservation(mealID, reserver, seatsNumber, next)
          }
        })
      } else {
        next({success: false, data: "That reservation didn't match our records!"})
      }
    }
  })
}

module.exports = {
  addMeal,
  deleteMeal,
  getMyMeals,
  getOpenMeals,
  reserveSeats,
  unreserveSeats
}
