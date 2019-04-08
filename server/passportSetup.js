const passport = require('passport');
const path = require('path');
const LocalStrategy = require('passport-local').Strategy;
const uuidv4 = require('uuid/v4')

const database = require(path.resolve(__dirname + '/../database'))
const { hash, compare } = require(path.resolve(__dirname + '/../encrypter'))
const mongoSetup = require(path.resolve(__dirname + '/mongoSetup'))

var database
mongoSetup.getDatabase(db => {database = db})

const USERS_COLLECTION = 'users'
const SESSIONS_COLLECTION = 'users'

passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log("Using local")
    db.collection(USERS_COLLECTION).findOne({ username: username }, (err, user) => {
      if (err || !user) { return done(err); }
      if (!compare(password, user.password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

passport.serializeUser((user, done) => {
  const newID = uuidv4();
  db.collection(SESSIONS_COLLECTION).deleteMany({username: user.username}, (err, nDeleted) => {
    db.collection(SESSIONS_COLLECTION).insertOne({sessionID: newID, username: user.username}, (err, id) => {
      done(null, newID)
    })
  })
});

passport.deserializeUser((id, done) => {
  db.collection(SESSIONS_COLLECTION).findOne({sessionID: id}, (err, user) => {
    if(err) {
      done(err, false)
    }
    else {
      console.log("Deserialized", user.username)
      done(null, user)
    }
  })
});
