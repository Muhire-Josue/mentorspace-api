import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server';
import adminToken from '../helper/tokens/adminToken';
import mentorToken from '../helper/tokens/mentorToken';
import newMentor from '../helper/testObj/newMentor';
import newUser from '../helper/testObj/newUser';
import User from '../model/user';
const { expect } = chai;
chai.use(chaiHttp);
chai.should();

describe('Admin tests', () => {
  
  before(() => {
    User.push(newUser);  
    User.push(newMentor);
  });

  it('should let admin to change', (done) => {
    chai.request(server)
      .patch('/api/v1/auth/user/10')
      .set('Authorization', `Bearer ${adminToken}`)
      .end((error, res) => {
        res.body.status.should.be.equal(200);
        expect(res.body.message).to.equal('User account changed to mentor');

      });
    done();
  });

  it('should not change the status of a mentor', (done) => {
    chai.request(server)
      .patch('/api/v1/auth/user/6')
      .set('Authorization', `Bearer ${adminToken}`)
      .end((error, res) => {
        res.body.status.should.be.equal(400);
        expect(res.body.error).to.equal('User is already a mentor');
      });
    done();
  });

  it('should not allow other users to change status', (done) => {
    chai.request(server)
      .patch('/api/v1/auth/user/10')
      .set('Authorization', `Bearer ${mentorToken}`)
      .end((error, res) => {
        res.body.status.should.be.equal(401);
        expect(res.body.error).to.equal('Unauthorized access');
      });
    done();
  });
});
