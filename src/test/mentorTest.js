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
});
