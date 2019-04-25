const express = require('express');
const router = express.Router();
const mealsLogic = require('mealsLogic')


router.post("/addMeal", (req, res, next) => {
  var username = req.root.username;
  var meal = req.meal
  mealsLogic.addMeal(username, meal, (obj) => res.json(obj))
})

/*
Takes in a mealID: string
*/

router.post("/deleteMeal", (req, res, next) => {
  var username = req.root.username;
  var mealID = req.mealID
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
  var seatsNumber = req.seatsNumber;
  var username = req.root.username;
  database.collection(MEALS).findOne({_id: req.meal_id}, (err, result) => {
    if(err) {
      res.json({success: false, data: "Meal couldn't be found"})
    } else {
      if(result.open_seats >= seatsNumber) {
        var updatedMeal = Object.assign(result,
          {
            open_seats: result.open_seats - seatsNumber,
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
