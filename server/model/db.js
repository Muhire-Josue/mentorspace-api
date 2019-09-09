import 'dotenv/config';
import pg from 'pg';

const { NODE_ENV } = process.env;
const env = NODE_ENV === 'test' || NODE_ENV === 'dev' ? `_${NODE_ENV}`.toUpperCase() : '';

const pool = new pg.Pool({
    connectionString: process.env[`DATABASE_URL${env}`],
});

pool.on('connect', () => {
    console.log('connected to the Database');
});

const dropTables = () => {

    const usersTable = 'DROP TABLE IF EXISTS users;';
    const sessionsTable = 'DROP TABLE IF EXISTS sessions;';

    const dropTablesQueries = `${sessionsTable};${usersTable}`;

    pool
        .query(dropTablesQueries)
        .then((res) => {
            console.log(res);
            pool.end();
        })
        .catch((err) => {
            console.log(err);
            pool.end();
        });

    pool.on('remove', () => {
        console.log('client removed');
        process.exit(0);
    });
};

const createTables = () => {
    const usersTable = `CREATE TABLE IF NOT EXISTS
      users(
        id SERIAL PRIMARY KEY,
        firstname VARCHAR(50) NOT NULL,
        lastname VARCHAR(50) NOT NULL,
        email VARCHAR(100) NULL,
        password TEXT NOT NULL,
        address VARCHAR(100) NULL,
        bio VARCHAR(255) NOT NULL,
        occupation VARCHAR(100) NOT NULL,
        expertise VARCHAR(50) NULL,
        status VARCHAR(50) NULL,
        "createdDate" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`;

      const sessionsTable = `CREATE TABLE IF NOT EXISTS
      sessions(
        "sessionId" SERIAL PRIMARY KEY,
        "mentorId" INT NOT NULL REFERENCES users(id),
        "menteeId" INT NOT NULL REFERENCES users(id),
        questions VARCHAR(100) NOT NULL,
        menteeEmail VARCHAR(100) NULL,
        status VARCHAR(20) NULL,
        "createdDate" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)`;


    const createTablesQueries = `${usersTable}; ${sessionsTable}`;

    pool
        .query(createTablesQueries)
        .then((res) => {
            console.log(res);
            pool.end();
        })
        .catch((err) => {
            console.log(err);
            pool.end();
        });
    pool.on('remove', () => {
        console.log('client removed');
        process.exit(0);
    });
};

export { dropTables, createTables, pool };

require('make-runnable');
