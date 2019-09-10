import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import db from '../model';
import server from '../../server';
import { createUser, createSession } from '../helper/testHelper';

chai.use(chaiHttp);
chai.should();

const user = {
  firstname: 'John',
  lastname: 'Doe',
  email: 'john@gmail.com',
  password: '12345',
  address: 'Lagos',
  bio: 'Senior DevOp manager',
  occupation: 'Senior software engineer',
  expertise: 'Senior backend engineer',
  status: 'user',
}

let normalUser = {};
let mentorUser = {};
let mentorUserTwo = {};
let newSession = {};
let newSessionTwo = {};

let normalUserToken = '';
let mentorUserToken = '';
let mentorUserTwoToken = '';

describe('Mentor tests', () => {
  before(async () => {
    try {
      await db.query('TRUNCATE users CASCADE; ALTER SEQUENCE users_id_seq RESTART WITH 1;');
      normalUser = await createUser();
      mentorUser = await createUser({
        ...user,
        status: 'mentor',
      });
      mentorUserTwo = await createUser({
        ...user,
        email: 'mentor@gmail.com',
        status: 'mentor',
      });
      newSession = await createSession(mentorUser.id, normalUser.id);
      newSessionTwo = await createSession(mentorUserTwo.id, normalUser.id);

      normalUserToken = jwt.sign(normalUser, process.env.API_SERCRET_KEY);
      mentorUserToken = jwt.sign(mentorUser, process.env.API_SERCRET_KEY);
      mentorUserTwoToken = jwt.sign(mentorUserTwo, process.env.API_SERCRET_KEY);
    } catch (error) {
      console.log(error);
    }
  });

  it('should be able to display all mentors', (done) => {
    chai.request(server)
      .get('/api/v1/mentors')
      .set('Authorization', `Bearer ${normalUserToken}`)
      .end((error, res) => {
        res.body.status.should.be.equal(200);
        done();
      });
  });


  it('should not display all mentors to other mentors', (done) => {
    chai.request(server)
      .get('/api/v1/mentors')
      .set('Authorization', `Bearer ${mentorUserToken}`)
      .end((error, res) => {
        res.body.status.should.be.equal(401);
        done();
      });
  });

  it('should allow to view a mentor', (done) => {
    chai.request(server)
      .get(`/api/v1/auth/mentors/${mentorUser.id}`)
      .set('Authorization', `Bearer ${normalUserToken}`)
      .end((error, res) => {
        res.body.status.should.be.equal(200);
        done();
      });
  });

  it('should not allow to view non-mentors', (done) => {
    chai.request(server)
      .get(`/api/v1/auth/mentors/${normalUser.id}`)
      .set('Authorization', `Bearer ${normalUserToken}`)
      .end((error, res) => {
        done();
      });
  });

  it('should  not allow other users to view a mentor', (done) => {
    chai.request(server)
      .get(`/api/v1/auth/mentors/${mentorUser.id}`)
      .set('Authorization', `Bearer ${mentorUserToken}`)
      .end((error, res) => {
        res.body.status.should.be.equal(401);
        done();
      });
  });

  it('should not be able to view a mentor with invalid', (done) => {
    chai.request(server)
      .get(`/api/v1/auth/mentors/abc`)
      .set('Authorization', `Bearer ${normalUserToken}`)
      .end((error, res) => {
        res.body.status.should.be.equal(400);
        done();
      });
  });

  it('should let mentor accept session request', (done) => {
    chai.request(server)
      .patch(`/api/v1/auth/sessions/${newSession.sessionId}/accept`)
      .set('Authorization', `Bearer ${mentorUserToken}`)
      .end((error, res) => {
        res.body.status.should.be.equal(200); 
        res.body.should.be.an('object');
        done();
      });
  });

  it('should not let mentor accept session twice', (done) => {
    chai.request(server)
      .patch(`/api/v1/auth/sessions/${newSession.sessionId}/accept`)
      .set('Authorization', `Bearer ${mentorUserToken}`)
      .end((error, res) => {
        res.body.status.should.be.equal(400); 
        res.body.should.be.an('object');
        done();
      });
  });

  it('should not allow mentor accept other session request', (done) => {
    chai.request(server)
      .patch(`/api/v1/auth/sessions/${newSessionTwo.sessionId}/accept`)
      .set('Authorization', `Bearer ${mentorUserToken}`)
      .end((error, res) => {
        res.body.status.should.be.equal(401);
        res.body.should.be.an('object');
        done();
      });
  });

  it('should not allow mentor accept non-existing session request', (done) => {
    chai.request(server)
      .patch('/api/v1/auth/sessions/5/accept')
      .set('Authorization', `Bearer ${mentorUserToken}`)
      .end((error, res) => {
        res.body.status.should.be.equal(404);
        res.body.should.be.an('object');
        done();
      });
  });

  it('should not let other users to accept session request', (done) => {
    chai.request(server)
      .patch(`/api/v1/auth/sessions/${newSession.sessionId}/accept`)
      .set('Authorization', `Bearer ${normalUserToken}`)
      .end((error, res) => {
        res.body.should.be.an('object');
        res.body.status.should.be.equal(401);
        done();
      });
  });

});
