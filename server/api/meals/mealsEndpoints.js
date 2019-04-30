const express = require('express');
const router = express.Router();
const mealsLogic = require('./mealsLogic')


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
  var seatsNumber = req.seatsNumber;
  mealsLogic.reserveSeats(mealID, username, seatsNumnber, (obj) => res.json(obj))
})

router.post("/unreserveSeats", (req,res, next) => {
  
})


module.exports = router
