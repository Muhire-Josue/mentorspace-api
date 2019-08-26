/* eslint-disable no-undef */
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

  it('should allow to view non-mentors', (done) => {
    chai.request(server)
      .get('/api/v1/auth/mentors/1')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImVtYWlsIjoib2x1YnVubWlAeWF3LmNvbSIsImZpcnN0bmFtZSI6Ik9sdWJ1bm1pIiwibGFzdG5hbWUiOiJZYXciLCJhZGRyZXNzIjoiR2lzZW55aSIsInN0YXR1cyI6InVzZXIiLCJpYXQiOjE1NjYzMTA0MTV9.IdhKy5sYAzU_-PDkD07wXSyyrdmIK6iJ2mxpPSl3mzQ')
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
});
