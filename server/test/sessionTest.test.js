import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server';
import session01 from '../helper/testObj/session1';
import session02 from '../helper/testObj/session2';
import session03 from '../helper/testObj/session3';
import session04 from '../helper/testObj/session04';
import userToken from '../helper/tokens/userToken';
import mentorToken from '../helper/tokens/mentorToken';
import User from '../model/user';
import Session from '../model/session';
import newUser from '../helper/testObj/newUser';
import user from '../helper/testObj/user';
const { expect } = chai;

chai.use(chaiHttp);
chai.should();

describe('Session Test',() => {

  before( () => {
    User.push(user);  
  });
  it('should allow users to create session request', (done) => {
    const session = session01;
    chai.request(server)
      .post('/api/v1/auth/sessions')
      .send(session)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        res.body.status.should.be.equal(201);
        res.body.should.be.an('object');
        expect(res.body.message).to.equal('Session created successfully');

      });
    done();
  });


  it('should allow not other type of users to create session', (done) => {
    const session = session01;

    chai.request(server)
      .post('/api/v1/auth/sessions')
      .send(session)
      .set('Authorization', `Bearer ${mentorToken}`)
      .end((err, res) => {
        res.body.status.should.be.equal(401);
        expect(res.body.error).to.equal('Unauthorized access');
      });
    done();
  });

  it('should not allow to create session if all fields are not provided', (done) => {
    const session = session03;

    chai.request(server)
      .post('/api/v1/auth/sessions')
      .send(session)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {        
        res.body.should.be.an('object');
        res.body.status.should.be.equal(403);
      });
    done();
  });


  it('should not allow to create session with non-mentors', (done) => {
    const session = session04;

    chai.request(server)
      .post('/api/v1/auth/sessions')
      .send(session)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        res.body.should.be.an('object');
        res.body.status.should.be.equal(400);
        expect(res.body.error).to.equal('Bad request');
      });
    done();
  });
  it('should reject users who did not sign in', (done) => {
    chai.request(server)
      .post('/api/v1/auth/sessions')
      .set('Authorization', 'Invalid token')
      .end((error, res) => {
        res.body.status.should.be.equal(401);
        res.body.should.be.an('object');
      });
    done();
  });
});

