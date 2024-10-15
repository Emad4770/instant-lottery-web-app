import sqlite from 'sqlite3';

const db = new sqlite.Database('./database.db', (err) => {
    if (err) {
        throw err;
    }
    // console.log('Connected to the database.');

    // Enable foreign key constraints
    db.run('PRAGMA foreign_keys = ON;', (err) => {
        if (err) {
            throw ('Foreign keys could not be enabled:', err.message);
        }
    });
});

export default db;