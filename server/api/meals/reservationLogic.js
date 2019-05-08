const express = require('express');
const path = require('path');
const router = express.Router();
const ObjectID = require('mongodb').ObjectID


const mongoSetup = require(path.resolve(__dirname + '/../../mongoSetup'))

var database
mongoSetup.getDatabase((db) => {database = db});
const RESERV = "reservations"

const addReservation = (reserver, mealID, seats, next) => {
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

const deleteReservation = (reserver, mealID, seats, next) => {
  database.collection(RESERV).removeOne({username: reserver, mealID: ObjectID(mealID), seats: seats},
    (err, result) => {
      if(err) {
        console.log(error)
        next({success: false, data: "Error occurred in database reservation deletion"})
      }
      else {
        next({success: true, data: "Reservation Canceled"})
      }
    })
}

const getReservations = (reserver, next) => {
  // database.collection(RESERV).find({username: reserver}).toArray((err, result) => {
  database.collection(RESERV).find({username: reserver}).toArray((err, result) => {
      if(err) {
        console.log(error)
        next({success: false, data: "Error occurred in database reservation retrieval"})
      }
      else {
        next(result)
      }
    })
}

module.exports = {
  addReservation,
  deleteReservation,
  getReservations
}
