import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import db from '../model/index';
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

let normalUserToken = '';
let mentorUserToken = '';
let mentorUserTwoToken = '';

describe('Session tests', () => {
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

      normalUserToken = jwt.sign(normalUser, process.env.API_SERCRET_KEY);
      mentorUserToken = jwt.sign(mentorUser, process.env.API_SERCRET_KEY);
      mentorUserTwoToken = jwt.sign(mentorUserTwo, process.env.API_SERCRET_KEY);
    } catch (error) {
      console.log(error);
    }
  });
  it('should allow users to create session request', (done) => {
    const session = {
      mentorId: mentorUser.id,
      questions: 'Hello world',
    };

    chai.request(server)
      .post('/api/v1/auth/sessions')
      .send(session)
      .set('Authorization', `Bearer ${normalUserToken}`)
      .end((err, res) => {       
        res.status.should.be.equal(201);
        res.body.should.be.an('object');
        done();
      });
  });


  it('should not allow other type of users to create session', (done) => {
    const session = {
      mentorId: mentorUserTwo.id,
      questions: 'Hello world',
    };

    chai.request(server)
      .post('/api/v1/auth/sessions')
      .send(session)
      .set('Authorization', `Bearer ${mentorUserToken}`)
      .end((err, res) => {
        res.body.status.should.be.equal(401);
        res.body.should.be.an('object');
        done();
      });
  });

  it('should not allow to create session if all fields are not provided', (done) => {
    const session = {
      mentorId: mentorUser.id
    };

    chai.request(server)
      .post('/api/v1/auth/sessions')
      .send(session)
      .set('Authorization', `Bearer ${normalUserToken}`)
      .end((err, res) => {
        res.body.status.should.be.equal(403);
        res.body.should.be.an('object');
        done();
      });
  });


  it('should not allow to create session with non-mentors', (done) => {
    const session = {
      mentorId: normalUser.id,
      questions: 'Hello',
    };

    chai.request(server)
      .post('/api/v1/auth/sessions')
      .send(session)
      .set('Authorization', `Bearer ${normalUserToken}`)
      .end((err, res) => {    
        res.body.should.be.an('object');
        res.body.status.should.be.equal(400);
        done();
      });
  });
  it('should reject users who did not sign in', (done) => {
    chai.request(server)
      .post('/api/v1/auth/sessions')
      .set('Authorization', 'Invalid token')
      .end((error, res) => {
        res.body.status.should.be.equal(401);
        res.body.should.be.an('object');
        done();
      });
  });
});
