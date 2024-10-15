import Dao from '../dao/dao-v2.mjs';
import dayjs from 'dayjs';
import UserDao from '../dao/user-dao.mjs';

const userDao = new UserDao();
const dao = new Dao();


/** initGame
 * Initializes a new game by creating a new draw and generating random numbers after 2 minutes; 
 * then calculates the points won by the users and updates the bets table with the result and the points won
 **/

async function initGame(timestamp, countdown) {

    try {
        countdown.startCountdown(); // Start the countdown
        const drawId = await dao.createDraw(timestamp); // Create a new draw

        setTimeout(async () => { // numbers are generated after 2 minutes from the draw creation

            const numbers = generateRandomNumbers(1, 90); // Generate 5 random numbers between 1 and 90
            await dao.addNumbersToDraw(drawId, numbers);
            const lastDraw = await dao.getLastDraw();
            await calculateAndUpdate(lastDraw); // Calculate the points won by the users and update the bets table
            console.log(`drawId: ${drawId}, numbers: ${numbers}`);
            const endTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
            console.log(`Game returned at ${endTime}`);


        }, 120000); // 2 minutes = 120000 milliseconds

    } catch (err) {
        return ({ message: `Error initializing the game ${err}` });
    }
}

// Generate 5 unique random numbers between min and max (inclusive)
function generateRandomNumbers(min, max) {
    // Create a set to store the random numbers and ensure they are unique
    const numbers = new Set();
    if (max - min + 1 < 5) { // Check if the range is at least 5
        throw new Error('Invalid range: The range must be at least 5');
    }
    while (numbers.size < 5) {
        const randomNum = Math.floor(Math.random() * (max - min + 1)) + min; // Generate a random number between min and max (inclusive)
        numbers.add(randomNum);
    }
    return Array.from(numbers);
}


// recieves a draw object, calculate the won points of all the users who have placed a bet for the draw
// and updates the bets table with the result and the points won
async function calculateAndUpdate(draw) {

    try {
        const drawId = draw.id;
        const drawnNumbers = draw.numbers;
        const bets = await dao.getBetsByDrawId(drawId); // Get all the bets for the draw
        bets.forEach(async (bet) => {
            let pointsWon = 0;
            let result = '';
            if (bet.numbers.some((number) => drawnNumbers.includes(number))) {
                const correctNumbers = bet.numbers.filter((number) => drawnNumbers.includes(number));
                pointsWon = 2 * (bet.points_spent * correctNumbers.length) / bet.numbers.length; // Calculate the points won by the user
                if (correctNumbers.length === bet.numbers.length) {
                    result = 'win';
                } else {
                    result = 'partial win';
                }
            } else {
                result = 'lose';
            }
            await dao.updateBetResult(bet.id, pointsWon, result, drawnNumbers); // Update the bet result in the database
            const user = await userDao.getUserById(bet.user_id);
            const oldTotalPoints = user.points;
            const newTotalPoints = oldTotalPoints + pointsWon;
            await dao.updateTotalPoints(bet.user_id, newTotalPoints); // Update the user's total points
            console.log('Bet results updated');
        });
    } catch (err) {
        return ({ message: `Error calculating points and updating bets table ${err}` });
    }
}

export default initGame;


