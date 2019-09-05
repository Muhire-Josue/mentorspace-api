import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server';

chai.use(chaiHttp);
chai.should();

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImVtYWlsIjoib2x1YnVubWlAeWF3LmNvbSIsImZpcnN0bmFtZSI6Ik9sdWJ1bm1pIiwibGFzdG5hbWUiOiJZYXciLCJhZGRyZXNzIjoiR2lzZW55aSIsInN0YXR1cyI6InVzZXIiLCJpYXQiOjE1NjYyMjk1Mzh9.2imFsSzBamjP1REeMgBhXXjP6qH4A3yERmnc8EQU_HI';
describe('Mentor tests', () => {
  it('should be able to display all mentors', (done) => {
    chai.request(server)
      .get('/api/v1/auth/mentors')
      .set('Authorization', `Bearer ${token}`)
      .end((error, res) => {
        res.body.status.should.be.equal(200);
      });
    done();
  });


  it('should not display all mentors to other mentors', (done) => {
    chai.request(server)
      .get('/api/v1/auth/mentors')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImVtYWlsIjoib2x1YnVubWlAeWF3LmNvbSIsImZpcnN0bmFtZSI6Ik9sdWJ1bm1pIiwibGFzdG5hbWUiOiJZYXciLCJhZGRyZXNzIjoiR2lzZW55aSIsInN0YXR1cyI6Im1lbnRvciIsImlhdCI6MTU2NjIzNDQzOX0.NEWkTg7qBAgMq0WQx6LpmwDHuCd8oICxoHC2k_3_ZTI')
      .end((error, res) => {
        res.body.status.should.be.equal(401);
      });
    done();
  });

  it('should allow to view a mentor', (done) => {
    chai.request(server)
      .get('/api/v1/auth/mentors/6')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImVtYWlsIjoib2x1YnVubWlAeWF3LmNvbSIsImZpcnN0bmFtZSI6Ik9sdWJ1bm1pIiwibGFzdG5hbWUiOiJZYXciLCJhZGRyZXNzIjoiR2lzZW55aSIsInN0YXR1cyI6InVzZXIiLCJpYXQiOjE1NjYzMTA0MTV9.IdhKy5sYAzU_-PDkD07wXSyyrdmIK6iJ2mxpPSl3mzQ')
      .end((error, res) => {
        res.body.status.should.be.equal(200);
      });
    done();
  });

  it('should not allow to view non-mentors', (done) => {
    chai.request(server)
      .get('/api/v1/auth/mentors/3')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImVtYWlsIjoibXVoaXJlam9lQGdtYWlsLmNvbSIsImZpcnN0bmFtZSI6Ik9sdWJ1bm1pIiwibGFzdG5hbWUiOiJZYXciLCJhZGRyZXNzIjoiR2lzZW55aSIsInN0YXR1cyI6InVzZXIiLCJpYXQiOjE1NjY4MjY2Njh9.yh9MV8eOI-Rj4Gp2rtKgaSe8JFxy2aELINN_Xj0kZ90')
      .end((error, res) => {
        res.body.status.should.be.equal(404);
      });
    done();
  });

  it('should  not allow other users to view a mentor', (done) => {
    chai.request(server)
      .get('/api/v1/auth/mentors/6')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImVtYWlsIjoib2x1YnVubWlAeWF3LmNvbSIsImZpcnN0bmFtZSI6Ik9sdWJ1bm1pIiwibGFzdG5hbWUiOiJZYXciLCJhZGRyZXNzIjoiR2lzZW55aSIsInN0YXR1cyI6Im1lbnRvciIsImlhdCI6MTU2NjMxMTMzMH0.c6UAhobuzjUioUh0dNb07DSybQxiqxDU5Hz3VYZoVmQ')
      .end((error, res) => {
        res.body.status.should.be.equal(401);
      });
    done();
  });
  it('should let mentor accept session request', (done) => {
    chai.request(server)
      .patch('/api/v1/auth/sessions/1/accept')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJhc2hhQGthaW4uY29tIiwiZmlyc3RuYW1lIjoiQXNoYSIsImxhc3RuYW1lIjoiS2FpbiIsImFkZHJlc3MiOiJuYWlyYm8iLCJzdGF0dXMiOiJtZW50b3IiLCJpYXQiOjE1NjYzMDUzODl9.IhPdQj_x-mID69lQSYM6i_d0ox43wNhu6XvnP1k9r1w')
      .end((error, res) => {
        res.body.should.be.an('object');
      });
    done();
  });

  it('should not allow mentor accept other session request', (done) => {
    chai.request(server)
      .patch('/api/v1/auth/sessions/2/accept')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJhc2hhQGthaW4uY29tIiwiZmlyc3RuYW1lIjoiQXNoYSIsImxhc3RuYW1lIjoiS2FpbiIsImFkZHJlc3MiOiJuYWlyYm8iLCJzdGF0dXMiOiJtZW50b3IiLCJpYXQiOjE1NjYzMDUzODl9.IhPdQj_x-mID69lQSYM6i_d0ox43wNhu6XvnP1k9r1w')
      .end((error, res) => {
        res.body.status.should.be.equal(401);
        res.body.should.be.an('object');
      });
    done();
  });

  it('should not allow mentor accept non-existing session request', (done) => {
    chai.request(server)
      .patch('/api/v1/auth/sessions/5/accept')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJhc2hhQGthaW4uY29tIiwiZmlyc3RuYW1lIjoiQXNoYSIsImxhc3RuYW1lIjoiS2FpbiIsImFkZHJlc3MiOiJuYWlyYm8iLCJzdGF0dXMiOiJtZW50b3IiLCJpYXQiOjE1NjYzMDUzODl9.IhPdQj_x-mID69lQSYM6i_d0ox43wNhu6XvnP1k9r1w')
      .end((error, res) => {
        res.body.should.be.an('object');
      });
    done();
  });

  it('should not let other users to accept session request', (done) => {
    chai.request(server)
      .patch('/api/v1/auth/sessions/1/accept')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImVtYWlsIjoib2x1YnVubWlAeWF3LmNvbSIsImZpcnN0bmFtZSI6Ik9sdWJ1bm1pIiwibGFzdG5hbWUiOiJZYXciLCJhZGRyZXNzIjoiR2lzZW55aSIsInN0YXR1cyI6InVzZXIiLCJpYXQiOjE1NjYzMDgyNzZ9.oyZVJqLCQqwuEWGtOYXNfMwF0IbcnESN_v3y6dBK5fA')
      .end((error, res) => {
        res.body.should.be.an('object');
        res.body.status.should.be.equal(400);
      });
    done();
  });

  it('should let mentor reject session request', (done) => {
    chai.request(server)
      .patch('/api/v1/auth/sessions/1/reject')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJhc2hhQGthaW4uY29tIiwiZmlyc3RuYW1lIjoiQXNoYSIsImxhc3RuYW1lIjoiS2FpbiIsImFkZHJlc3MiOiJuYWlyYm8iLCJzdGF0dXMiOiJtZW50b3IiLCJpYXQiOjE1NjYzMDg2MjJ9.KRvmu1PIEWBY81YjSQeeXeo4UKRNq9g9DtLVASXrb7Q')
      .end((error, res) => {
        res.body.should.be.an('object');
      });
    done();
  });

  it('should not let other users to accept session request', (done) => {
    chai.request(server)
      .patch('/api/v1/auth/sessions/1/reject')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImVtYWlsIjoib2x1YnVubWlAeWF3LmNvbSIsImZpcnN0bmFtZSI6Ik9sdWJ1bm1pIiwibGFzdG5hbWUiOiJZYXciLCJhZGRyZXNzIjoiR2lzZW55aSIsInN0YXR1cyI6InVzZXIiLCJpYXQiOjE1NjYzMDk3NzZ9.IpLPN88NOYqKKm0XvIqeIANOQYdweAtBl__J6TDzCLQ')
      .end((error, res) => {
        res.body.should.be.an('object');
      });
    done();
  });

  it('should not let mentor reject  others session request', (done) => {
    chai.request(server)
      .patch('/api/v1/auth/sessions/2/reject')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJhc2hhQGthaW4uY29tIiwiZmlyc3RuYW1lIjoiQXNoYSIsImxhc3RuYW1lIjoiS2FpbiIsImFkZHJlc3MiOiJuYWlyYm8iLCJzdGF0dXMiOiJtZW50b3IiLCJpYXQiOjE1NjYzMDg2MjJ9.KRvmu1PIEWBY81YjSQeeXeo4UKRNq9g9DtLVASXrb7Q')
      .end((error, res) => {
        res.body.should.be.an('object');
        res.body.status.should.be.equal(401);
      });
    done();
  });

  it('should not let mentor reject  non-existing session request', (done) => {
    chai.request(server)
      .patch('/api/v1/auth/sessions/5/reject')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJhc2hhQGthaW4uY29tIiwiZmlyc3RuYW1lIjoiQXNoYSIsImxhc3RuYW1lIjoiS2FpbiIsImFkZHJlc3MiOiJuYWlyYm8iLCJzdGF0dXMiOiJtZW50b3IiLCJpYXQiOjE1NjYzMDg2MjJ9.KRvmu1PIEWBY81YjSQeeXeo4UKRNq9g9DtLVASXrb7Q')
      .end((error, res) => {
        res.body.should.be.an('object');
      });
    done();
  });
});
