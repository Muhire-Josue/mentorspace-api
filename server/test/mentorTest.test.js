import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server';
import userToken from '../helper/tokens/userToken';
import mentorToken from '../helper/tokens/mentorToken';
import newMentor from '../helper/testObj/newMentor';
import newSession from '../helper/testObj/newSession';
import otherMentorToken  from '../helper/tokens/otherMentor';
import User from '../model/user';
import Session from '../model/session';
import newUser from '../helper/testObj/newUser';

chai.use(chaiHttp);
chai.should();
const { expect } = chai;

describe('Mentor tests', () => {

  before(() => {
    User.push(newUser);  
    User.push(newMentor);
    Session.push(newSession);
  });

  it('should be able to display all mentors', (done) => {
    chai.request(server)
      .get('/api/v1/auth/mentors')
      .set('Authorization', `Bearer ${userToken}`)
      .end((error, res) => {
        res.body.status.should.be.equal(200);
        expect(res.body.message).to.equal('All mentors');
      });
    done();
  });


  it('should not display all mentors to other mentors', (done) => {
    chai.request(server)
      .get('/api/v1/auth/mentors')
      .set('Authorization', `Bearer ${mentorToken}`)
      .end((error, res) => {
        res.body.status.should.be.equal(401);
        expect(res.body.error).to.equal('Unauthorized access');
      });
    done();
  });

  it('should allow to view a mentor', (done) => {
    chai.request(server)
      .get('/api/v1/auth/mentors/6')
      .set('Authorization', `Bearer ${userToken}`)
      .end((error, res) => {
        res.body.status.should.be.equal(200);
        expect(res.body.message).to.equal('Mentor profile');
      });
    done();
  });

  it('should not allow to view non-mentors', (done) => {
    chai.request(server)
      .get('/api/v1/auth/mentors/3')
      .set('Authorization', `Bearer ${userToken}`)
      .end((error, res) => {
        res.body.status.should.be.equal(404);
        expect(res.body.error).to.equal('Mentor not found');
      });
    done();
  });

  it('should  not allow other users to view a mentor', (done) => {
    chai.request(server)
      .get('/api/v1/auth/mentors/6')
      .set('Authorization', `Bearer ${mentorToken}`)
      .end((error, res) => {
        res.body.status.should.be.equal(401);
        expect(res.body.error).to.equal('Unauthorized access');
      });
    done();
  });
  it('should let mentor accept session request', (done) => {
    chai.request(server)
      .patch('/api/v1/auth/sessions/1/accept')
      .set('Authorization', `Bearer ${mentorToken}`)
      .end((error, res) => {      
        res.body.status.should.be.equal(200);
        res.body.should.be.an('object');
        expect(res.body.message).to.equal('Session accepted');
      });
    done();
  });

  it('should not allow mentor accept other session request', (done) => {
    chai.request(server)
      .patch('/api/v1/auth/sessions/1/accept')
      .set('Authorization', `Bearer ${otherMentorToken}`)
      .end((error, res) => {
        res.body.status.should.be.equal(401);
        res.body.should.be.an('object');
        expect(res.body.error).to.equal('Unauthorized access');
      });
    done();
  });

  it('should not allow mentor accept non-existing session request', (done) => {
    chai.request(server)
      .patch('/api/v1/auth/sessions/5/accept')
      .set('Authorization', `Bearer ${mentorToken}`)
      .end((error, res) => {
        res.body.status.should.be.equal(404);
        res.body.should.be.an('object');
        expect(res.body.error).to.equal('session not found');
      });
    done();
  });

  it('should not let other users to accept session request', (done) => {
    chai.request(server)
      .patch('/api/v1/auth/sessions/1/accept')
      .set('Authorization', `Bearer ${userToken}`)
      .end((error, res) => {
        res.body.should.be.an('object');
        res.body.status.should.be.equal(400);
        expect(res.body.error).to.equal('Unauthorized access');
      });
    done();
  });

  it('should let mentor accept session request', (done) => {
    chai.request(server)
      .patch('/api/v1/auth/sessions/1/reject')
      .set('Authorization', `Bearer ${mentorToken}`)
      .end((error, res) => {      
        res.body.status.should.be.equal(200);
        res.body.should.be.an('object');
        expect(res.body.message).to.equal('Session rejected');
      });
    done();
  });

  it('should not let other users to reject session request', (done) => {
    chai.request(server)
      .patch('/api/v1/auth/sessions/1/reject')
      .set('Authorization', `Bearer ${userToken}`)
      .end((error, res) => {
        res.body.status.should.be.equal(400);
        res.body.should.be.an('object');
        expect(res.body.error).to.equal('Unauthorized access');
      });
    done();
  });

  it('should not let mentor reject  others session request', (done) => {
    chai.request(server)
      .patch('/api/v1/auth/sessions/1/reject')
      .set('Authorization', `Bearer ${otherMentorToken}`)
      .end((error, res) => {
        res.body.should.be.an('object');
        res.body.status.should.be.equal(401);
        expect(res.body.error).to.equal('Unauthorized access');
      });
    done();
  });

  it('should not let mentor reject  non-existing session request', (done) => {
    chai.request(server)
      .patch('/api/v1/auth/sessions/5/reject')
      .set('Authorization', `Bearer ${mentorToken}`)
      .end((error, res) => {
        res.body.status.should.be.equal(404);
        res.body.should.be.an('object');
        expect(res.body.error).to.equal('session not found');

      });
    done();
  });
});
