const express = require('express');
const router = express.Router();
const mealsLogic = require('./mealsLogic')
const reservationLogic = require('./reservationLogic')


router.post("/addMeal", (req, res, next) => {
  var username = req.root.username;
  var meal = req.body.meal
  mealsLogic.addMeal(username, meal, (obj) => res.json(obj))
})

/*
Takes in a mealID: string
*/

router.post("/deleteMeal", (req, res, next) => {
  var username = req.root.username;
  var mealID = req.body.mealID;
  mealsLogic.deleteMeal(username, mealID, (obj) => res.json(obj))
})


router.post("/getMyMeals", (req, res, next) => {
  var username = req.root.username;
  mealsLogic.getMyMeals(username, (obj) => res.json(obj))
})

router.post("/getOpenMeals", (req, res, next) => {
  mealsLogic.getOpenMeals((obj) => res.json(obj))
})

/*
Takes in a meal_id: string, seatsNumber: integer
*/
router.post("/reserveSeats", (req, res, next) => {
  var mealID = req.body.mealID;
  var username = req.root.username;
  var seatsNumber = req.body.seatsNumber;
  mealsLogic.reserveSeats(mealID, username, seatsNumber, (obj) => res.json(obj))
})

router.post("/unreserveSeats", (req,res, next) => {
  var mealID = req.body.mealID;
  var username = req.root.username;
  var seatsNumber = req.body.seatsNumber;
  mealsLogic.unreserveSeats(mealID, username, seatsNumber, (obj) => res.json(obj))
})

router.post("/getReservations", (req,res, next) => {
  var username = req.root.username;
  mealsLogic.getReservations(username, (obj) => res.json(obj))
})


module.exports = router
