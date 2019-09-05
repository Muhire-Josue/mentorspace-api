import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server';
import session01 from '../helper/testObj/session1';
import session02 from '../helper/testObj/session2';
import session03 from '../helper/testObj/session3';
import session04 from '../helper/testObj/session04';
const { expect } = chai;

chai.use(chaiHttp);
chai.should();
describe('Sessions tests', () => {
  it('should allow users to create session request', (done) => {
    const session = session01;

    chai.request(server)
      .post('/api/v1/auth/sessions')
      .send(session)
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImVtYWlsIjoib2x1YnVubWlAeWF3LmNvbSIsImZpcnN0bmFtZSI6Ik9sdWJ1bm1pIiwibGFzdG5hbWUiOiJZYXciLCJhZGRyZXNzIjoiR2lzZW55aSIsInN0YXR1cyI6InVzZXIiLCJpYXQiOjE1NjYzMDY4Njh9.Pp9_u4M-n-hUuPktt9u6cjuZfYoUWHDlkNaQq-xkoqk')
      .end((err, res) => {
        res.body.status.should.be.equal(201);
        res.body.should.be.an('object');
        expect(res.body.message).to.equal('Session created successfully');

      });
    done();
  });


  it('should allow not other type of users to create session', (done) => {
    const session = session02;

    chai.request(server)
      .post('/api/v1/auth/sessions')
      .send(session)
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImVtYWlsIjoib2x1YnVubWlAeWF3LmNvbSIsImZpcnN0bmFtZSI6Ik9sdWJ1bm1pIiwibGFzdG5hbWUiOiJZYXciLCJhZGRyZXNzIjoiR2lzZW55aSIsInN0YXR1cyI6Im1lbnRvciIsImlhdCI6MTU2NjMwMTc0Nn0.QV1zSWcoy7p1RTDjDF-lF2_xNiE-STPncttcosGi3wQ')
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
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImVtYWlsIjoib2x1YnVubWlAeWF3LmNvbSIsImZpcnN0bmFtZSI6Ik9sdWJ1bm1pIiwibGFzdG5hbWUiOiJZYXciLCJhZGRyZXNzIjoiR2lzZW55aSIsInN0YXR1cyI6InVzZXIiLCJpYXQiOjE1NjYyOTk4MTJ9.HM1o8BFFMkDwEukHULcEI7Ola1sPht5g9mp56Cnnsts')
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
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImVtYWlsIjoib2x1YnVubWlAeWF3LmNvbSIsImZpcnN0bmFtZSI6Ik9sdWJ1bm1pIiwibGFzdG5hbWUiOiJZYXciLCJhZGRyZXNzIjoiR2lzZW55aSIsInN0YXR1cyI6InVzZXIiLCJpYXQiOjE1NjYyOTk4MTJ9.HM1o8BFFMkDwEukHULcEI7Ola1sPht5g9mp56Cnnsts')
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
