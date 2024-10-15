import db from './db.mjs';
import crypto from "crypto";


export default class UserDao {

    getUserByCredentials(username, password) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM users WHERE username = ?`;
            db.get(sql, [username], (err, row) => {
                if (err) {
                    reject(err);
                } else if (row === undefined) {
                    resolve(false);
                } else {
                    const user = { id: row.id, username: row.username, points: row.points, name: row.name };
                    crypto.scrypt(password, row.salt, 32, (err, hashedPassword) => {
                        if (err) {
                            reject(err);
                        } else if (!crypto.timingSafeEqual(Buffer.from(row.password, 'hex'), hashedPassword)) {
                            resolve(false);
                        } else {
                            resolve(user);
                        }
                    }
                    );
                }
            });
        });
    }


    getUserById(userId) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM users WHERE id = ?`;
            db.get(sql, [userId], (err, row) => {
                if (err) {
                    reject(err);
                } else if (row === undefined) {
                    reject(false);
                } else {
                    const user = { id: row.id, username: row.username, points: row.points, name: row.name };
                    resolve(user);
                }
            });
        });
    }
}


