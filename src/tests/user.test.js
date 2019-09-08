/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server';
import db from '../model';

chai.use(chaiHttp);
chai.should();

// Sign Up
// eslint-disable-next-line no-undef
describe('User tests', () => {
  // clear users table
  before(async () => {
    try {
      await db.query('TRUNCATE users CASCADE; ALTER SEQUENCE users_id_seq RESTART WITH 1;');
    } catch (error) {
      console.log(error);
    }
  });

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
        done();
      });
  });
  it('Should not work if all fields are not filled', (done) => {
    const user = {
      firstname: 'Josue',
      email: 'josue@gmail.com',
      password: 'example12',
      address: 'kigali-rwanda',
      bio: 'DevOp manager',
      occupation: 'software engineer',
      expertise: 'backend engineer',
      status: 'user',
    };
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((req, res) => {
        res.body.should.be.an('object');
        res.body.status.should.be.equal(400);
        res.body.error.should.be.a('string');
        done();
      });
  });

  it('Should not sign up existing email', (done) => {
    const user = {
      firstname: 'Josue',
      email: 'muhirejosue@gmail.com',
      password: 'example12',
      address: 'kigali-rwanda',
      bio: 'DevOp manager',
      occupation: 'software engineer',
      expertise: 'backend engineer',
      status: 'user',
    };

    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((req, res) => {
        res.body.status.should.be.equal(400);
        res.body.should.be.an('object');
        res.body.error.should.be.a('string');
        done();
      });
  });

  it('Should not accept incorrect email input format', (done) => {
    const user = {
      firstname: 'Josue',
      lastname: 'Muhire',
      email: 123,
      password: 'example12',
      address: 'kigali-rwanda',
      bio: 'DevOp manager',
      occupation: 'software engineer',
      expertise: 'backend engineer',
      status: 'user',
    };

    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((req, res) => {
        res.body.should.be.an('object');
        res.body.status.should.be.equal(400);
        res.body.error.should.be.a('string');
        done();
      });

  });

  it('Should not accept an already used email', (done) => {
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
      .end((req, res) => {
        res.body.should.be.an('object');
        res.body.status.should.be.equal(401);
        res.body.error.should.be.a('string');
        done();
      });
  });
  // Sign In
  it('Should be login', (done) => {
    const user = {
      email: 'olubunmi@yaw.com',
      password: 'user4',
    };

    chai.request(server)
      .post('/api/v1/auth/signin')
      .send(user)
      .end((req, res) => {
        res.body.status.should.be.equal(200);
        res.body.should.be.an('object');
        done();
      });
  });

  it('Should not SignIn non-existing email', (done) => {
    const user = {
      email: 'muhirejosue@gmail.com',
      password: 'user1',
    };
    chai.request(server)
      .post('/api/v1/auth/signin')
      .send(user)
      .end((req, res) => {
        res.body.status.should.be.equal(404);
        done();
      });
  });


  it('should not be able to signin when not signed up', (done) => {
    const user = {
      email: 'a@gmail.com',
      password: 'bertin123',
    };
    chai.request(server)
      .post('/api/v1/auth/signin')
      .send(user)
      .end((err, res) => {
        res.body.status.should.be.equal(404);
        res.body.should.be.an('object');
        res.body.error.should.be.equal('user not found');
        done();
      });
  });

  it('should not be able to signin when passwords are not matching', (done) => {
    const user = {
      email: 'olubunmi@yaw.com',
      password: 'trash',
    };
    chai.request(server)
      .post('/api/v1/auth/signin')
      .send(user)
      .end((err, res) => {
        res.body.status.should.be.equal(400);
        res.body.should.be.an('object');
        res.body.error.should.be.equal('password not matching');
        done();
      });
  });
});
