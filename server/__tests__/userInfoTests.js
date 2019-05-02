const chai = require('chai')
const chaiHttp = require('chai-http')
var assert = chai.assert
const uuid = require('uuid/v4')
const {app, server} = require('../app')
const path = require('path')
const mongoSetup = require(path.resolve(__dirname + '/../mongoSetup'))

chai.use(chaiHttp)
chai.should()
const INFO = 'userInfo'

var test_session_id
var TEST_NAME = 'testusername1'
var TEST_PASS = 'testpasscode1'

const testInfo = {rating: 3}

const chaiSignIn = (app, username, password, next) => {
  chai.request(app)
      .post('/api/signin/login')
      .set('content-type', 'application/json')
      .send(JSON.stringify({username: username, password: password}))
      .end((err, res, body) => {
          next(res.body.sessionID)
      })
}

before(done => {
  mongoSetup.getDatabase(
    (db) => {
      // populate the database with the test meals and then get a few login sessionIDs
      chaiSignIn(app, TEST_NAME, TEST_PASS, (id) => {
        test_session_id = id
        console.log("USER INFO TEST", TEST_NAME, id)
        done()
      })
    })
})

describe('USER INFO', () => {
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
      });
    })
})

after(done => {
  server.close();
  done()
})
