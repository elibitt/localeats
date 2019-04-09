const express = require('express');
const path = require('path');
const passport = require('passport');

const mongoSetup = require(path.resolve(__dirname + '/mongoSetup'))

const mealsRouter = require(path.resolve(__dirname + '/api/meals'))

const { signInRouter, isLoggedInMiddleware } = require(path.resolve(__dirname + '/api/signin'))

const port = 80
const app = express()

var database
var counter = 0

mongoSetup.startMongo()
// when database loads, places it into database variable
mongoSetup.getDatabase((db) => {database = db});

app.use("/api/signin", signInRouter)
app.use("/api/meals", isLoggedInMiddleware, mealsRouter)

app.get("/", (req, res) => {
  counter += 1
  database.collection('count').replaceOne({name: "counter"}, {name: "counter", value: counter}, {upsert: true}, (err, result) => {
  })
  console.log(counter)
  res.json("Got it!")
})

app.get("/show", (req, res) => {
  database.collection('count').findOne({name: "counter"}, (err, result) => {
    if(err) {
      res.json("ERROR")
    }
    else {
      console.log(result)
      res.json(result.value)
    }
  })
})

app.listen(port, () => console.log("listening on port: ", port))
