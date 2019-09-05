import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server';
import user01 from '../helper/testObj/user1';
import user02 from '../helper/testObj/user2';
import user03 from '../helper/testObj/user3';
import user04 from '../helper/testObj/user4';
import user05 from '../helper/testObj/user5';
import user06 from '../helper/testObj/user6';
import user07 from '../helper/testObj/user7';
import user08 from '../helper/testObj/user8';
import user09 from '../helper/testObj/user9';

chai.use(chaiHttp);
const { expect } = chai;
chai.should();

// Sign Up
describe('User tests', () => {
  it('should be signup', (done) => {
    const user = {
      firstname: 'Olubunmi',
      lastname: 'Yaw',
      email: 'olubunmi@yaw.com',
      password: 'user4',
      address: 'Gisenyi',
      bio: 'HRmanager',
      occupation: 'Human resources',
      expertise: 'HR Manager',
      status: 'user',
    };
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((error, res) => {
        res.body.status.should.be.equal(201);
        res.body.should.be.an('object');
        res.body.data.should.have.property('firstname');
        res.body.data.should.have.property('lastname');
        res.body.data.should.have.property('email');
        res.body.data.should.have.property('password');
        res.body.data.should.have.property('address');
        res.body.data.should.have.property('bio');
        res.body.data.should.have.property('occupation');
        res.body.data.should.have.property('expertise');
        res.body.data.should.have.property('status');
        expect(res.body.message).to.equal('User created successfully');
        done();
      });
  });
  it('Should not work if all fields are not filled', (done) => {
    const user = user02;
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((req, res) => {
        res.body.should.be.an('object');
        res.body.status.should.be.equal(400);

      });
    done();
  });

  it('Should not sign up existing email', (done) => {
    const user = user03;

    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((req, res) => {
        res.body.status.should.be.equal(401);
        res.body.should.be.an('object');
        res.body.error.should.be.a('string');
        expect(res.body.error).to.equal('Email already exist');
      });
    done();
  });

  it('Should not accept incorrect email input format', (done) => {
    const user = user04;

    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((req, res) => {
        res.body.should.be.an('object');
        res.body.status.should.be.equal(400);
      });

    done();
  });

  // Sign In
  it('Should be login', (done) => {
    const user = user06;

    chai.request(server)
      .post('/api/v1/auth/signin')
      .send(user)
      .end((req, res) => {
        res.body.status.should.be.equal(200);
        res.body.should.be.an('object');
        expect(res.body.message).to.equal('User is successfully logged in');
      });
    done();
  });

  it('Should not SignIn non-existing email', (done) => {
    const user = user07;
    chai.request(server)
      .post('/api/v1/auth/signin')
      .send(user)
      .end((req, res) => {
        res.body.status.should.be.equal(404);
        expect(res.body.error).to.equal('user not found');
      });
    done();
  });


  it('should not be able to signin when not signed up', (done) => {
    const user = user08;
    chai.request(server)
      .post('/api/v1/auth/signin')
      .send(user)
      .end((err, res) => {
        res.body.status.should.be.equal(404);
        res.body.should.be.an('object');
        res.body.error.should.be.equal('user not found');
      });
    done();
  });

  it('should not be able to signin when passwords are not matching', (done) => {
    const user = user09;
    chai.request(server)
      .post('/api/v1/auth/signin')
      .send(user)
      .end((err, res) => {
        res.body.status.should.be.equal(400);
        res.body.should.be.an('object');
        res.body.error.should.be.equal('password not matching');
      });
    done();
  });
});
