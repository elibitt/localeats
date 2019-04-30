const chai = require('chai')
const chaiHttp = require('chai-http')
var assert = chai.assert
const uuid = require('uuid/v4')
const {app, server} = require('../app')
const path = require('path')
const mongoSetup = require(path.resolve(__dirname + '/../mongoSetup'))

chai.use(chaiHttp)
chai.should()
const USERS = 'users'

// make a new name and password
var genName
var genPass

var TEST_NAME = 'testusername1'
var TEST_PASS = 'testpasscode1'


before(done => {
  mongoSetup.getDatabase(
    (db) => {
      genName = uuid()
      genPass = uuid()
      done()
    })
})

describe('USERS', () => {
    it('register_same_name', (done) => {
      chai.request(app)
          .post('/api/signin/register')
          .set('content-type', 'application/json')
          .send(JSON.stringify({username: TEST_NAME, password: TEST_PASS}))
          .end((err, res, body) => {
            if(err) {
              assert(false)
              done()
            } else {
              res.body.should.have.property('success', false)
              res.body.should.have.property('data', "Username already exists")
              done()
            }
          })
      });

    // this is also to test that the session_id we get back form the
    // register function works
    it('register_new_name_then_get_username', (done) => {
      chai.request(app)
          .post('/api/signin/register')
          .set('content-type', 'application/json')
          .send(JSON.stringify({username: genName, password: genPass}))
          .end((err, res, body) => {
            if(err) {
              assert(false)
              done()
            } else {
              res.body.should.have.property('success', true)
              res.body.should.have.property('sessionID');
              var sessionID = res.body.sessionID
              chai.request(app)
                  .post('/api/signin/getUsername')
                  .set('content-type', 'application/json')
                  .send(JSON.stringify({sessionID: sessionID}))
                  .end((err, res, body) => {
                    if(err) {
                      assert(false)
                      done()
                    } else {
                      res.body.should.have.property('success', true)
                      res.body.should.have.property('data', genName)
                      done()
                    }
                })
            }
          })
      });

    it('login_name_preregistered', (done) => {
      chai.request(app)
          .post('/api/signin/login')
          .set('content-type', 'application/json')
          .send(JSON.stringify({username: TEST_NAME, password: TEST_PASS}))
          .end((err, res, body) => {
            if(err) {
              assert(false)
              done()
            } else {
              res.body.should.have.property('success', true)
              res.body.should.have.property('sessionID')
              done()
            }
          })
      });
    it('login_name_wrong_pass', (done) => {
      chai.request(app)
          .post('/api/signin/login')
          .set('content-type', 'application/json')
          .send(JSON.stringify({username: TEST_NAME, password: 'wrong_pass'}))
          .end((err, res, body) => {
            if(err) {
              assert(false)
              done()
            } else {
              res.body.should.have.property('success', false)
              res.body.should.have.property('data', 'Incorect password or username')
              done()
            }
          })
      });
    it('login_name_just_registered', (done) => {
      chai.request(app)
          .post('/api/signin/login')
          .set('content-type', 'application/json')
          .send(JSON.stringify({username: genName, password: genPass}))
          .end((err, res, body) => {
            if(err) {
              done()
              assert(false)
            } else {
              res.body.should.have.property('success', true)
              res.body.should.have.property('sessionID')
              done()
            }
          })
      });
      it('bad_session_id', (done) => {
        chai.request(app)
            .post('/api/signin/getUsername')
            .set('content-type', 'application/json')
          .send(JSON.stringify({sessionID: uuid()}))
            .end((err, res, body) => {
              if(err) {
                assert(false)
                done()
              } else {
                res.body.should.have.property('success', false)
                res.body.should.have.property('data', "Your sessionID could not be verified, please login")
                done()
              }
            })
        });
})

after(done => {
  server.close();
  done()
})
