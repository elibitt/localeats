const express = require('express');
const path = require('path');
const passport = require('passport');
const bodyparser = require('body-parser')

const mongoSetup = require(path.resolve(__dirname + '/mongoSetup'))

const { signInRouter, isLoggedInMiddleware } = require(path.resolve(__dirname + '/api/signin'))
const mealsRouter = require(path.resolve(__dirname + '/api/meals/mealsEndpoints'))
const userInfoRouter = require(path.resolve(__dirname + '/api/userInfoEndpoints'))

console.log("the port is ", process.env.PORT)
console.log("the mongo is ", process.env.MONGODB_URL)
const port = parseInt(process.env.PORT)

const app = express()

var database
var counter = 0

mongoSetup.startMongo()
// when database loads, places it into database variable
mongoSetup.getDatabase((db) => {database = db});

app.use(bodyparser.json())
app.use("/api/signin", signInRouter)
app.use("/api/user", isLoggedInMiddleware, userInfoRouter)
app.use("/api/meals", isLoggedInMiddleware, mealsRouter)

server = app.listen(port, () => console.log("listening on port: ", port))

module.exports = {app, server}
