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

    it('register_new_name', (done) => {
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
              res.body.should.have.property('data', "New profile created, please log in")
              done()
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
              res.body.should.have.property('data')
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
            } else {
              res.body.should.have.property('success', true)
              res.body.should.have.property('data')
              done()
            }
          })
      });
})

after(done => {
  server.close();
  done()
})
