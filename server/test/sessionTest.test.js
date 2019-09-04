import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server';

chai.use(chaiHttp);
chai.should();
describe('Sessions tests', () => {
  it('should allow users to create session request', (done) => {
    const session = {
      mentorId: 6,
      questions: 'Hello world',
    };

    chai.request(server)
      .post('/api/v1/auth/sessions')
      .send(session)
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImVtYWlsIjoib2x1YnVubWlAeWF3LmNvbSIsImZpcnN0bmFtZSI6Ik9sdWJ1bm1pIiwibGFzdG5hbWUiOiJZYXciLCJhZGRyZXNzIjoiR2lzZW55aSIsInN0YXR1cyI6InVzZXIiLCJpYXQiOjE1NjYzMDY4Njh9.Pp9_u4M-n-hUuPktt9u6cjuZfYoUWHDlkNaQq-xkoqk')
      .end((err, res) => {
        res.body.should.be.an('object');
      });
    done();
  });


  it('should allow not other type of users to create session', (done) => {
    const session = {
      mentorId: 6,
      questions: 'Hello world',
    };

    chai.request(server)
      .post('/api/v1/auth/sessions')
      .send(session)
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImVtYWlsIjoib2x1YnVubWlAeWF3LmNvbSIsImZpcnN0bmFtZSI6Ik9sdWJ1bm1pIiwibGFzdG5hbWUiOiJZYXciLCJhZGRyZXNzIjoiR2lzZW55aSIsInN0YXR1cyI6Im1lbnRvciIsImlhdCI6MTU2NjMwMTc0Nn0.QV1zSWcoy7p1RTDjDF-lF2_xNiE-STPncttcosGi3wQ')
      .end((err, res) => {
        res.body.status.should.be.equal(401);
      });
    done();
  });

  it('should not allow to create session if all fields are not provided', (done) => {
    const session = {
      mentorId: 6,

    };

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
    const session = {
      mentorId: 2,
      questions: 'Hello world',
    };

    chai.request(server)
      .post('/api/v1/auth/sessions')
      .send(session)
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImVtYWlsIjoib2x1YnVubWlAeWF3LmNvbSIsImZpcnN0bmFtZSI6Ik9sdWJ1bm1pIiwibGFzdG5hbWUiOiJZYXciLCJhZGRyZXNzIjoiR2lzZW55aSIsInN0YXR1cyI6InVzZXIiLCJpYXQiOjE1NjYyOTk4MTJ9.HM1o8BFFMkDwEukHULcEI7Ola1sPht5g9mp56Cnnsts')
      .end((err, res) => {
        res.body.should.be.an('object');
        res.body.status.should.be.equal(400);
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
