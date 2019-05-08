const chai = require('chai')
const chaiHttp = require('chai-http')
var assert = chai.assert
const uuid = require('uuid/v4')
const {app, server} = require('../app')
const path = require('path')
const mongoSetup = require(path.resolve(__dirname + '/../mongoSetup'))
const ObjectID = require('mongodb').ObjectID

chai.use(chaiHttp)
chai.should()
const MEALS = 'users'

// make a new name and password
var TEST_NAME = 'testusername1'
var TEST_PASS = 'testpasscode1'

var TEST_NAME2 = 'testusername2'
var TEST_PASS2 = 'testpasscode2'

var TEST_NAME3 = 'testusername3'
var TEST_PASS3 = 'testpasscode3'

var test_session_id
var test_session_id2
var test_session_id3

const mealObject0 = {
  seats: 6,
  address: "123 Test Road, Pittsburgh Pennsylvania, 17356",
  description: "Grilled Chicken"
}

const mealObject1 = {
  seats: 4,
  address: "321 Java Road, Pittsburgh Pennsylvania, 17356",
  description: "Pizza"
}

const mealObject2 = {
  seats: 8,
  address: "456 Unit Road, Pittsburgh Pennsylvania, 17356",
  description: "Ice Cream"
}

const mealObject3 = {
  seats: 10,
  address: "789 Code Road, Pittsburgh Pennsylvania, 17356",
  description: "French Fries"
}

const badMealObject1 = {
  seats: -3,
  address: "123 Test Road, Pittsburgh Pennsylvania, 17356",
  description: "Grilled Chicken"
}

const badMealObject2 = {
  address: "123 Test Road, Pittsburgh Pennsylvania, 17356",
  description: "Grilled Chicken"
}

const testInfo = {rating: 3.4}

const chaiSignIn = (app, username, password, next) => {
  chai.request(app)
      .post('/api/signin/login')
      .set('content-type', 'application/json')
      .send(JSON.stringify({username: username, password: password}))
      .end((err, res, body) => {
          next(res.body.sessionID)
      })
}

const addChaiMeal = (app, meal, sessionID, next) => {
  chai.request(app)
      .post('/api/meals/addMeal')
      .set('content-type', 'application/json')
      .send(JSON.stringify({sessionID: sessionID, meal: meal}))
      .end((err, res, body) => {
        next()
      })
}

const addChaiMealArray = (app, mealArray, sessionID, next) => {
  if(mealArray && mealArray.length != 0) {
    meal = mealArray.pop()
    addChaiMeal(app, meal, sessionID, () => addChaiMealArray(app, mealArray, sessionID, next))
  } else {
    next()
  }
}

before(done => {
  mongoSetup.getDatabase(
    (db) => {
      // populate the database with the test meals and then get a few login sessionIDs
      chaiSignIn(app, TEST_NAME, TEST_PASS, (id) => {
        test_session_id = id
          chaiSignIn(app, TEST_NAME2, TEST_PASS2, (id2) => {
            test_session_id2 = id2
            chaiSignIn(app, TEST_NAME3, TEST_PASS3, (id3) => {
              test_session_id3 = id3
              addChaiMealArray(app, [mealObject1, mealObject2, mealObject3], id, done)
            })
          })
        })
      })
    })

describe('MEALS and USERINFO', () => {
    it('test_add_meal', (done) => {
      chai.request(app)
          .post('/api/meals/addMeal')
          .set('content-type', 'application/json')
          .send(JSON.stringify({sessionID: test_session_id, meal: mealObject0}))
          .end((err, res, body) => {
            if(err) {
              assert(false)
              done()
            } else {
              res.body.should.have.property('success', true)
              res.body.should.have.property('mealID')
              res.body.should.have.property('data', "Meal uploaded successfully!")
              done()
            }
          })
      });

      it('test_add_then_delete_meal', (done) => {
        chai.request(app)
            .post('/api/meals/addMeal')
            .set('content-type', 'application/json')
            .send(JSON.stringify({sessionID: test_session_id, meal: mealObject0}))
            .end((err, res, body) => {
              if(err) {
                assert(false)
                done()
              } else {
                res.body.should.have.property('success', true)
                res.body.should.have.property('mealID')
                res.body.should.have.property('data', "Meal uploaded successfully!")
                var mealID = res.body.mealID
                chai.request(app)
                    .post('/api/meals/deleteMeal')
                    .set('content-type', 'application/json')
                    .send(JSON.stringify({sessionID: test_session_id, mealID: mealID}))
                    .end((err, res, body) => {
                      if(err) {
                        assert(false)
                        done()
                      } else {
                        res.body.should.have.property('success', true)
                        res.body.should.have.property('data', "Meal deleted successfully!")
                        done()
                      }
                    })
              }
            })
        });

        it('test_delete_nonexistent_meal', (done) => {
          var oi = new ObjectID()
          chai.request(app)
              .post('/api/meals/deleteMeal')
              .set('content-type', 'application/json')
              .send(JSON.stringify({sessionID: test_session_id, mealID: oi.toString()}))
              .end((err, res, body) => {
                if(err) {
                  assert(false)
                  done()
                } else {
                  res.body.should.have.property('success', false)
                  res.body.should.have.property('data', "Meal couldn't be deleted - deletedCount = 0 ")
                  done()
                }
            })
        });
        it('test_add_bad_meal_1', (done) => {
            chai.request(app)
                .post('/api/meals/addMeal')
                .set('content-type', 'application/json')
                .send(JSON.stringify({sessionID: test_session_id, meal: badMealObject1}))
                .end((err, res, body) => {
                  if(err) {
                    assert(false)
                    done()
                  } else {
                    res.body.should.have.property('success', false)
                    res.body.should.have.property('data', 'Bad meal object - incorrect value for param: seats')
                    done()
                  }
              })
          });

          it('test_add_bad_meal_2', (done) => {
              chai.request(app)
                  .post('/api/meals/addMeal')
                  .set('content-type', 'application/json')
                  .send(JSON.stringify({sessionID: test_session_id, meal: badMealObject2}))
                  .end((err, res, body) => {
                    if(err) {
                      assert(false)
                      done()
                    } else {
                    res.body.should.have.property('success', false)
                    res.body.should.have.property('data', 'Bad meal object - incorrect value for param: seats')
                      done()
                    }
                })
            });

          it('test_get_my_meals', (done) => {
              chai.request(app)
                  .post('/api/meals/getMyMeals')
                  .set('content-type', 'application/json')
                  .send(JSON.stringify({sessionID: test_session_id}))
                  .end((err, res, body) => {
                    if(err) {
                      assert(false)
                      done()
                    } else {
                      res.body.should.have.property('success', true)
                      res.body.should.have.property('data')
                      res.body.data.should.be.an('array')
                      for(var i = 0; i < res.body.data.length; i++) {
                        var meal = res.body.data[i]
                        meal.should.have.property('host', TEST_NAME)
                      }
                      done()
                    }
                })
            });

          it('test_get_open_meals', (done) => {
              chai.request(app)
                  .post('/api/meals/getOpenMeals')
                  .set('content-type', 'application/json')
                  .send(JSON.stringify({sessionID: test_session_id}))
                  .end((err, res, body) => {
                    if(err) {
                      assert(false)
                      done()
                    } else {
                      res.body.should.have.property('success', true)
                      res.body.should.have.property('data')
                      res.body.data.should.be.an('array')
                      for(var i = 0; i < res.body.data.length; i++) {
                        var meal = res.body.data[i]
                        meal.should.have.property('openSeats').that.is.above(0)
                      }
                      done()
                    }
                })
            });


        it('test_set_user_info', (done) => {
          chai.request(app)
              .post('/api/user/setInfo')
              .set('content-type', 'application/json')
              .send(JSON.stringify({sessionID: test_session_id, info: {rating: 5}}))
              .end((err, res, body) => {
                if(err) {
                  assert(false)
                  done()
                } else {
                  res.body.should.have.property('success', true)
                  res.body.should.have.property('data', "User info was inserted")
                  done()
                }
              })
          });

        it('test_set_get_user_info', (done) => {
          chai.request(app)
              .post('/api/user/setInfo')
              .set('content-type', 'application/json')
              .send(JSON.stringify({sessionID: test_session_id, info: testInfo}))
              .end((err, res, body) => {
                if(err) {
                  assert(false)
                  done()
                } else {
                  res.body.should.have.property('success', true)
                  res.body.should.have.property('data', "User info was inserted")
                  chai.request(app)
                      .post('/api/user/getInfo')
                      .set('content-type', 'application/json')
                      .send(JSON.stringify({sessionID: test_session_id, username: TEST_NAME}))
                      .end((err, res, body) => {
                        if(err) {
                          assert(false)
                          done()
                        } else {
                          res.body.should.have.property('success', true)
                          res.body.should.have.property('data')
                          res.body.data.should.have.property('info')
                          assert.deepEqual(res.body.data.info, testInfo)
                          done()
                        }
                  })
                }
          })
        });

        it('test_set_reservation', (done) => {
          chai.request(app)
              .post('/api/meals/getOpenMeals')
              .set('content-type', 'application/json')
              .send(JSON.stringify({sessionID: test_session_id}))
              .end((err, res, body) => {
                if(err) {
                  assert(false)
                  done()
                } else {
                  res.body.should.have.property('success', true)
                  res.body.should.have.property('data')
                  var mealID = res.body.data[0]._id;
                  chai.request(app)
                      .post('/api/meals/reserveSeats')
                      .set('content-type', 'application/json')
                      .send(JSON.stringify({sessionID: test_session_id2, mealID: mealID, seatsNumber: 2}))
                      .end((err, res, body) => {
                        if(err) {
                          assert(false)
                          done()
                        } else {
                          res.body.should.have.property('success', true)
                          res.body.should.have.property('data', "Your seats have been reserved")
                          chai.request(app)
                              .post('/api/meals/getReservations')
                              .set('content-type', 'application/json')
                              .send(JSON.stringify({sessionID: test_session_id2}))
                              .end((err, res, body) => {
                                if(err) {
                                  assert(false)
                                  done()
                                } else {
                                  res.body.should.have.property('success', true)
                                  res.body.should.have.property('data')
                                  var reserv = res.body.data.filter(x => x.mealID = mealID)
                                  assert(reserv.length != 0)
                                  done()
                                }
                              })
                        }
                  })
                }
          })
        });

        it('test_set_then_cancel_reservation', (done) => {
          chai.request(app)
              .post('/api/meals/getOpenMeals')
              .set('content-type', 'application/json')
              .send(JSON.stringify({sessionID: test_session_id}))
              .end((err, res, body) => {
                if(err) {
                  assert(false)
                  done()
                } else {
                  res.body.should.have.property('success', true)
                  res.body.should.have.property('data')
                  var mealID = res.body.data[0]._id;
                  chai.request(app)
                      .post('/api/meals/reserveSeats')
                      .set('content-type', 'application/json')
                      .send(JSON.stringify({sessionID: test_session_id3, mealID: mealID, seatsNumber: 2}))
                      .end((err, res, body) => {
                        if(err) {
                          assert(false)
                          done()
                        } else {
                          res.body.should.have.property('success', true)
                          res.body.should.have.property('data', "Your seats have been reserved")
                          chai.request(app)
                              .post('/api/meals/unreserveSeats')
                              .set('content-type', 'application/json')
                              .send(JSON.stringify({sessionID: test_session_id3, mealID: mealID, seatsNumber: 2}))
                              .end((err, res, body) => {
                                if(err) {
                                  assert(false)
                                  done()
                                } else {
                                  res.body.should.have.property('success', true)
                                  res.body.should.have.property('data', 'Reservation Canceled')
                                  chai.request(app)
                                      .post('/api/meals/getReservations')
                                      .set('content-type', 'application/json')
                                      .send(JSON.stringify({sessionID: test_session_id3}))
                                      .end((err, res, body) => {
                                        if(err) {
                                          assert(false)
                                          done()
                                        } else {
                                          res.body.should.have.property('success', true)
                                          res.body.should.have.property('data')
                                          console.log("Data", res.body.data)
                                          var reserv = res.body.data.filter(x => x.mealID == mealID)
                                          assert(reserv.length == 0)
                                          done()
                                        }
                                      })
                                }
                              })
                        }
                  })
                }
          })
        });
})

after(done => {
  server.close();
  done()
})
