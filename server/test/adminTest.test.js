import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server';

chai.use(chaiHttp);
chai.should();

describe('Admin tests', () => {
  // Admin

  it('should let admin to change', (done) => {
    chai.request(server)
      .patch('/api/v1/auth/user/1')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImVtYWlsIjoib2x1YnVubWlAeWF3LmNvbSIsImZpcnN0bmFtZSI6Ik9sdWJ1bm1pIiwibGFzdG5hbWUiOiJZYXciLCJhZGRyZXNzIjoiR2lzZW55aSIsInN0YXR1cyI6ImFkbWluIiwiaWF0IjoxNTY2Mjk4NzkyfQ.3wPLDSWYa_XgVcObTS_Xge7PJNaGNFvPMzrVGu1Sxak')
      .end((error, res) => {
        res.body.status.should.be.equal(200);
      });
    done();
  });

  it('should not change the status of a mentor', (done) => {
    chai.request(server)
      .patch('/api/v1/auth/user/4')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImVtYWlsIjoib2x1YnVubWlAeWF3LmNvbSIsImZpcnN0bmFtZSI6Ik9sdWJ1bm1pIiwibGFzdG5hbWUiOiJZYXciLCJhZGRyZXNzIjoiR2lzZW55aSIsInN0YXR1cyI6ImFkbWluIiwiaWF0IjoxNTY2Mjk4NzkyfQ.3wPLDSWYa_XgVcObTS_Xge7PJNaGNFvPMzrVGu1Sxak')
      .end((error, res) => {
        res.body.status.should.be.equal(400);
      });
    done();
  });

  it('should not allow other users to change status', (done) => {
    chai.request(server)
      .patch('/api/v1/auth/user/4')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImVtYWlsIjoib2x1YnVubWlAeWF3LmNvbSIsImZpcnN0bmFtZSI6Ik9sdWJ1bm1pIiwibGFzdG5hbWUiOiJZYXciLCJhZGRyZXNzIjoiR2lzZW55aSIsInN0YXR1cyI6Im1lbnRvciIsImlhdCI6MTU2NjIzNDQzOX0.NEWkTg7qBAgMq0WQx6LpmwDHuCd8oICxoHC2k_3_ZTI')
      .end((error, res) => {
        res.body.status.should.be.equal(401);
      });
    done();
  });
});
