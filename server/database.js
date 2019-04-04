const MongoClient = require('mongodb').MongoClient;
const promiseRetry = require('promise-retry');

const mongoOptions = {
		useNewUrlParser: true,
		reconnectTries: 100,
		reconnectInterval: 1000,
		autoReconnect: true
}
const url = "mongodb://localhost:27017/";

const promiseOptions = {
	retries: mongoOptions.reconnectTries,
	factor: 2,
	minTimeout: mongoOptions.reconnectInterval,
	maxTimeout: 5000
}

var database
var started = false
const DATABASE_NAME = 'users';

const startMongo = () => {
	return promiseRetry((retry, number) => {
		return MongoClient.connect(url, mongoOptions).catch(retry);
	}, promiseOptions).then(mongoClient => {
		database = mongoClient.db(DATABASE_NAME)
		started = true;
	})
}

const getDatabase = () => {
	return database
}

module.exports = {
  startMongo,
  getDatabase
}
