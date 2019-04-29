const express = require('express');
const path = require('path');
const router = express.Router();
const mealsLogic = require('./mealsLogic')

const mongoSetup = require(path.resolve(__dirname + '/../../mongoSetup'))

var database
mongoSetup.getDatabase((db) => {database = db});
const RESERV = "reservations"

const addReservation = (mealID, seats, reserver, next) => {
  database.collection(RESERV).insertOne({username: reserver, mealID: ObjectID(mealID), seats: seats},
    (err, result) => {
      if(err) {
        console.log(error)
        next({success: false, data: "Error occurred in databse reservation insertion"})
      }
      else {
        next({success: true, data: "Your seats have been reserved"})
      }
    })
}

const deleteReservation = (mealId, reserver, mealID, next) => {
  database.collection(RESERV).removeOne({username: reserver, mealID: ObjectID(mealID), seats: seats},
    (err, result) => {
      if(err) {
        console.log(error)
        next({success: false, data: "Error occurred in database reservation deletion"})
      }
      else {
        next({success: true, data: "reservationCanceled"})
      }
    })
}

const getReservations = (reserver, next) => {
  database.collection(RESERV).find({username: reserver}, (err, result) => {
      if(err) {
        console.log(error)
        next({success: false, data: "Error occurred in database reservation retrieval"})
      }
      else {
        mealsLogic.getMeals(result.map(x => x._id), (meals) => {
          mealsDict = {}
          for meal in meals {
              mealsDict[meal._id] = meal
          }
          for reservation in result {
            reservation["meal"] = mealsDict[result.mealID]
          }
          next({success: true, data: result})
        })
      }
    })
}

module.exports = {
  addReservation,
  deleteReservation,
  getReservations
}
