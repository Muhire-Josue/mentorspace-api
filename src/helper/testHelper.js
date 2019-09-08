import hash from 'bcrypt-nodejs';
import db from '../model';

const user = {
    firstname: 'Josue',
    lastname: 'Muhire',
    email: 'muhirejosue09@gmail.com',
    password: '12345',
    address: 'kigali',
    bio: 'DevOp manager',
    occupation: 'software engineer',
    expertise: 'backend engineer',
    status: 'user',
};
const session = {
    questions: 'Hey there, could we talk',
    menteeEmail: 'muhirejosue09@gmail.com',
    status: 'pending',
};

export const createUser = async (data = user) => {
    const text = `INSERT INTO
        users(firstname, lastname, email, password, address, bio, occupation, expertise, status)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
        returning id, firstname, lastname, email, password, address, bio, occupation, expertise, status, "createdDate"`;

    const values = [
        data.firstname, data.lastname, data.email, hash.hashSync(data.password), data.address, data.bio, data.occupation, data.expertise, data.status,
    ];

    const { rows } = await db.query(text, values);

    return rows[0];
}

export const createSession = async (mentorId, menteeId) => {
    const text = `INSERT INTO
    sessions("mentorId", "menteeId", questions, menteeEmail, status)
    VALUES($1, $2, $3, $4, $5)
    returning *`;

    const values = [mentorId, menteeId, session.questions, session.menteeEmail, session.status];
    const { rows } = await db.query(text, values);
    
    return rows[0];
}

