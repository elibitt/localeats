const express = require('express');
const path = require('path');
const router = express.Router();

const mongoSetup = require(path.resolve(__dirname + '../../mongoSetup'))

var database
mongoSetup.getDatabase((db) => {database = db});
const RESERV = "reservations"

const addReservation = (mealID, seats, reserver, next) => {
  database.collection(RESERV).insertOne({username: reserver, mealID: ObjectID(mealID), seats: seats},
    (err, result) => {
      if(err) {
        next({success: false, data: "Error occurred in reservation insertion"})
      }
      else {
        next({success: true, data: "Your seats have been reserved"})
      }
    })
}

const deleteReservation = (mealId, seats, reserver, next) => {

}
