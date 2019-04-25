const express = require('express');
const path = require('path');
const router = express.Router();

const mongoSetup = require(path.resolve(__dirname + '/../mongoSetup'))

var database
mongoSetup.getDatabase((db) => {database = db});
const USERS = "users"
const MEALS = "users"

const addReservation = (mealId, seats, reserver, callback) => {

}

const deleteReservation = (mealId, seats, reserver, callback) => {

}
