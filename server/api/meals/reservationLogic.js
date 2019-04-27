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
        next({success: false, data: "Error occurred in database reservation retrieval"})
      }
      else {
        // TODO add the meal objects to the returned value
        next({success: true, data: result})
      }
    })
}

module.exports = {
  addReservation,
  deleteReservation,
  getReservations
}
