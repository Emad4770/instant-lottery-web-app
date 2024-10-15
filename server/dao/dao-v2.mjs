import db from "./db.mjs";

export default class Dao {

    // creates a new draw with the given timestamp and returns the id of the new draw
    createDraw(timestamp) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO draws (timestamp) VALUES (?)`;
            db.run(sql, [timestamp], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });
    }

    // gets the last draw, the one with the most recent timestamp; also returns the numbers if they have been set
    getLastDraw() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM draws ORDER BY timestamp DESC LIMIT 1`;
            db.get(sql, (err, row) => {
                if (err) {
                    reject(err);
                } else if (row === undefined) {
                    reject({ error: 'No draws found!' });
                }
                else {
                    // Convert the comma-separated numbers string back to an array
                    if (row.numbers) {
                        row.numbers = row.numbers.split(',').map(Number);
                    }
                    resolve(row);
                }
            });
        });
    }
    // adds the given numbers to the draw with the given id
    addNumbersToDraw(drawId, numbers) {
        return new Promise((resolve, reject) => {
            // Validate the numbers array length and that they are within the valid range
            if (numbers.length !== 5 || numbers.some(num => num < 1 || num > 90)) {
                reject('Invalid numbers: You must provide exactly 5 distinct numbers in the range of 1-90.');
            }
            else {
                const sql = `UPDATE draws SET numbers = ? WHERE id = ?`;
                db.run(sql, [numbers.join(','), drawId], function (err) {
                    if (err) {
                        reject(err);
                    } else if (this.changes === 0) {
                        reject({ error: 'Draw not found' });
                    }
                    else {
                        resolve({ error: 'Numbers added to draw' });
                    }
                })
            }
        });
    }

    // creates a new bet with the given user id, draw id and numbers; returns the id of the new bet
    createBet(userId, drawId, numbers, timestamp, spentPoints) {
        return new Promise((resolve, reject) => {
            // Validate the numbers array length and that they are within the valid range
            if (numbers.length > 3 || numbers.length < 1 || numbers.some(num => num < 1 || num > 90)) {
                reject({ error: 'Invalid numbers: You must provide between 1 to 3 distinct numbers in the range of 1-90.' });
            }
            const sql = `INSERT INTO bets (user_id, draw_id, numbers, timestamp, points_spent) VALUES (?, ?, ?, ?,?)`;
            db.run(sql, [userId, drawId, numbers.join(','), timestamp, spentPoints], function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(this.lastID);
                }
            });
        });
    }

    // checks if the user has already bet on the draw; returns true if the user has not bet on the draw before
    checkAlreadyBet(userId, drawId) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM bets WHERE user_id = ? AND draw_id = ?`;
            db.get(sql, [userId, drawId], (err, row) => {
                if (err) {
                    reject(err);
                }
                else if (row == undefined) { // the user has not bet on this draw before
                    resolve(true);
                }
                else {
                    reject({ error: 'You have already bet on this draw.' });
                }
            });
        });
    }

    // gets the user's bet on the draw with the given user id and draw id
    getUserBet(userId, drawId) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM bets WHERE user_id = ? AND draw_id = ?`;
            db.get(sql, [userId, drawId], (err, row) => {
                if (err) {
                    reject(err);
                } else if (row === undefined) {
                    resolve({ error: 'User has placed no bets for this draw' });
                }
                else {
                    // Convert the comma-separated numbers string back to an array
                    if (row.numbers) {
                        row.numbers = row.numbers.split(',').map(Number);
                    }
                    if (row.drawn_numbers) {
                        row.drawn_numbers = row.drawn_numbers.split(',').map(Number);
                    }
                    resolve(row);
                }
            });
        });
    }

    getAllUserBets(userId) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM bets WHERE user_id = ?`;
            db.all(sql, [userId], (err, rows) => {
                if (err) {
                    reject(err);
                } else if (rows.length === 0) {
                    reject({ error: 'User has placed no bets' });
                }
                else {
                    resolve(rows.map(row => {
                        // Convert the comma-separated numbers string back to an array
                        // if (row.numbers) {
                        //     row.numbers = row.numbers.split(',').map(Number);
                        // }
                        // if (row.drawn_numbers) {
                        //     row.drawn_numbers = row.drawn_numbers.split(',').map(Number);
                        // }
                        return row;
                    }));
                }
            });
        });
    }

    // gets all the bets on the draw with the given draw id
    getBetsByDrawId(drawId) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM bets WHERE draw_id = ?`;
            db.all(sql, [drawId], (err, rows) => {
                if (err) {
                    reject(err);
                } else if (rows.length === 0) {
                    reject({ error: 'No bets found for this draw' });
                }
                else {
                    resolve(rows.map(row => {
                        // Convert the comma-separated numbers string back to an array
                        if (row.numbers) {
                            row.numbers = row.numbers.split(',').map(Number);
                        }
                        if (row.drawn_numbers) {
                            row.drawn_numbers = row.drawn_numbers.split(',').map(Number);
                        }
                        return row;
                    }));
                }
            });
        });
    }

    updateBetResult(betId, pointsWon, result, drawnNumbers) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE bets SET points_won = ?, result = ?, drawn_numbers = ? WHERE id = ?`;
            db.run(sql, [pointsWon, result, drawnNumbers.join(','), betId], function (err) {
                if (err) {
                    reject(err);
                } else if (this.changes === 0) {
                    reject({ error: 'Bet not found' });
                }
                else {
                    resolve({ betId: betId, points: pointsWon, result: result, drawnNumbers: drawnNumbers });
                }
            });
        });
    }

    // updates the total points of the user with the given id
    updateTotalPoints(userId, points) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE users SET points = ? WHERE id = ?`;
            db.run(sql, [points, userId], function (err) {
                if (err) {
                    reject(err);
                } else if (this.changes === 0) {
                    reject({ error: 'User not found' });
                }
                else {
                    resolve({ userId: userId, points: points });
                }
            });
        });
    }

    // gets the top 3 players with the most points
    getTopPlayers() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT id, username, points, name FROM users ORDER BY points DESC LIMIT 3`;
            db.all(sql, (err, rows) => {
                if (err) {
                    reject(err);
                } else if (rows.length === 0) {
                    reject({ error: 'No players found.' });
                }
                else {
                    resolve(rows);
                }
            });
        });
    }
}
