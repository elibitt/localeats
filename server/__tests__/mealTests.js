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

var test_session_id

const mealObject = {
  seats: 6,
  address: "123 Test Road, Pittsburgh Pennsylvania, 17356",
  description: "Grilled Chicken"
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

before(done => {
  mongoSetup.getDatabase(
    (db) => {
      chai.request(app)
          .post('/api/signin/login')
          .set('content-type', 'application/json')
          .send(JSON.stringify({username: TEST_NAME, password: TEST_PASS}))
          .end((err, res, body) => {
              res.body.should.have.property('success', true)
              test_session_id = res.body.sessionID
              done()
      })})
})

describe('MEALS', () => {
    it('test_add_meal', (done) => {
      chai.request(app)
          .post('/api/meals/addMeal')
          .set('content-type', 'application/json')
          .send(JSON.stringify({sessionID: test_session_id, meal: mealObject}))
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
            .send(JSON.stringify({sessionID: test_session_id, meal: mealObject}))
            .end((err, res, body) => {
              if(err) {
                assert(false)
                done()
              } else {
                res.body.should.have.property('success', true)
                res.body.should.have.property('mealID')
                res.body.should.have.property('data', "Meal uploaded successfully!")
                var mealID = res.body.mealID
                console.log("TEST", mealID)
                chai.request(app)
                    .post('/api/meals/deleteMeal')
                    .set('content-type', 'application/json')
                    .send(JSON.stringify({sessionID: test_session_id, mealID: mealID}))
                    .end((err, res, body) => {
                      if(err) {
                        assert(false)
                        done()
                      } else {
                        console.log(res.body)
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
                  res.body.should.have.property('data', "Meal couldn't be deleted")
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

})

after(done => {
  server.close();
  done()
})
