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
let adminUser = {};

let normalUserToken = '';
let mentorUserToken = '';
let adminUserToken = '';

describe('Admin tests', () => {
  before(async () => {
    try {
      await db.query('TRUNCATE users CASCADE; ALTER SEQUENCE users_id_seq RESTART WITH 1;');
      normalUser = await createUser();
      mentorUser = await createUser({
        ...user,
        status: 'mentor',
      });
      adminUser = await createUser({
        ...user,
        email: 'admin@gmail.com',
        status: 'admin',
      });

      normalUserToken = jwt.sign(normalUser, process.env.API_SERCRET_KEY);
      mentorUserToken = jwt.sign(mentorUser, process.env.API_SERCRET_KEY);
      adminUserToken = jwt.sign(adminUser, process.env.API_SERCRET_KEY);
    } catch (error) {
      console.log(error);
    }
  });

  it('should let admin to change user to mentor', (done) => {
    chai.request(server)
      .patch(`/api/v1/auth/user/${normalUser.id}`)
      .set('Authorization', `Bearer ${adminUserToken}`)
      .end((error, res) => {        
        res.body.status.should.be.equal(200);
        done();
      });
  });

  it('should not let admin change non-existing users', (done) => {
    chai.request(server)
      .patch(`/api/v1/auth/user/10`)
      .set('Authorization', `Bearer ${adminUserToken}`)
      .end((error, res) => {        
        res.body.status.should.be.equal(404);
        done();
      });
  });

    it('should not change the status of a mentor', (done) => {
    chai.request(server)
      .patch(`/api/v1/auth/user/${mentorUser.id}`)
      .set('Authorization', `Bearer ${adminUserToken}`)
      .end((error, res) => {
        res.body.status.should.be.equal(400);
        done();
      });
  });

    it('should not allow other users to change status', (done) => {
    chai.request(server)
    .patch(`/api/v1/auth/user/${normalUser.id}`)
    .set('Authorization', `Bearer ${normalUserToken}`)
      .end((error, res) => {
        res.body.status.should.be.equal(401);
        done();
      });
  });
});
