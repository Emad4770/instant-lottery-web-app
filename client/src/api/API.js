
const SERVER_URL = 'http://localhost:3001/api';

/**
 * This function wants username and password inside a "credentials" object.
 * It executes the log-in.
 */
const logIn = async (credentials) => {
    try {
        const response = await fetch(SERVER_URL + '/sessions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',  // this parameter specifies that authentication cookie must be forwared. It is included in all the authenticated APIs.
            body: JSON.stringify(credentials),
        });
        if (!response.ok) {

            const errorData = await response.json(); // this is the error message sent by the server
            throw new Error(errorData.error)
        }
        let type = response.headers.get('Content-Type');
        if (type !== null && type.indexOf('application/json') === -1) {
            throw new TypeError(`Expected JSON, got ${type}`)
        }
        const user = await response.json();
        return user;

    } catch (error) {
        throw new Error(error.message);
    }
};

/**
 * This function is used to verify if the user is still logged-in.
 * It returns a JSON object with the user info.
 */
const getUserInfo = async () => {
    try {
        const response = await fetch(SERVER_URL + '/sessions/current', {
            credentials: 'include'
        })

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error)
        }
        let type = response.headers.get('Content-Type');
        if (type !== null && type.indexOf('application/json') === -1) {
            throw new TypeError(`Expected JSON, got ${type}`)
        }
        const user = await response.json();
        return user;


    } catch (error) {
        throw new Error(error.message);
    }
};

/**
 * This function destroy the current user's session (executing the log-out).
 */
const logOut = async () => {
    try {
        const response = await fetch(SERVER_URL + '/sessions/current', {
            method: 'DELETE',
            credentials: 'include'
        });
        // await handleInvalidResponse(response);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error)
        }
        let type = response.headers.get('Content-Type');
        if (type !== null && type.indexOf('application/json') === -1) {
            throw new TypeError(`Expected JSON, got ${type}`)
        }

    } catch (error) {
        throw new Error(error.message);
    }
}
/**
 * This function adds a bet with the specified numbers.
 * It sends a POST request to the server with the numbers in the request body.
 * Returns a JSON object with the response.
 * @param {Array} numbers - The numbers to bet on.
 * @returns {Promise} - A promise that resolves to the response JSON object.
 */
const addBet = async (numbers) => {

    try {
        const response = await fetch(SERVER_URL + '/bets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ numbers: numbers }),
        })
        if (!response.ok) {

            const errorData = await response.json();
            throw new Error(errorData.error)
        }
        let type = response.headers.get('Content-Type');
        if (type !== null && type.indexOf('application/json') === -1) {
            throw new TypeError(`Expected JSON, got ${type}`)
        }
        const bet = await response.json();
        return bet;
    } catch (error) {
        throw new Error(error.message);

    }
}

/**
 * This function retrieves the result of the draw for the user.
 * It sends a GET request to the server and returns a JSON object with the result.
 * @returns {Promise} - A promise that resolves to the response JSON object.
 */
const getResult = async () => {
    try {
        const response = await fetch(SERVER_URL + '/result', {
            credentials: 'include'
        })
        if (!response.ok) {

            const errorData = await response.json();
            throw new Error(errorData.error)
        }
        let type = response.headers.get('Content-Type');
        if (type !== null && type.indexOf('application/json') === -1) {
            throw new TypeError(`Expected JSON, got ${type}`)
        }
        const result = await response.json();
        return result;
    } catch (error) {
        throw new Error(error.message);
    }

}

/**
 * This function retrieves the remaining time until the next draw.
 * It sends a GET request to the server and returns a JSON object with the remaining time.
 * @returns {Promise} - A promise that resolves to the response JSON object.
 */
const getRemainingTime = async () => {
    try {
        const response = await fetch(SERVER_URL + '/remaining-time', {
            credentials: 'include'
        })
        if (!response.ok) {

            const errorData = await response.json();
            throw new Error(errorData.error)
        }
        let type = response.headers.get('Content-Type');
        if (type !== null && type.indexOf('application/json') === -1) {
            throw new TypeError(`Expected JSON, got ${type}`)
        }
        const remainingTime = await response.json();
        return remainingTime;
    } catch (error) {
        throw new Error(error.message);
    }
}

/**
 * This function retrieves the top players.
 * It sends a GET request to the server and returns a JSON object with the top players.
 * @returns {Promise} - A promise that resolves to the response JSON object.
 */
const getTopPlayers = async () => {
    try {
        const response = await fetch(SERVER_URL + '/top-players', {
            credentials: 'include'
        })
        if (!response.ok) {

            const errorData = await response.json();
            throw new Error(errorData.error)
        }
        let type = response.headers.get('Content-Type');
        if (type !== null && type.indexOf('application/json') === -1) {
            throw new TypeError(`Expected JSON, got ${type}`)
        }
        const topPlayers = await response.json();
        return topPlayers;
    } catch (error) {
        throw new Error(error.message);
    }
}

/**
 * This function retrieves the betting history.
 * It sends a GET request to the server and returns a JSON object with the betting history.
 * @returns {Promise} - A promise that resolves to the response JSON object.
 */
const getHistory = async () => {
    try {
        const response = await fetch(SERVER_URL + '/history', {
            credentials: 'include'
        })
        if (!response.ok) {

            const errorData = await response.json();
            throw new Error(errorData.error)
        }
        let type = response.headers.get('Content-Type');
        if (type !== null && type.indexOf('application/json') === -1) {
            throw new TypeError(`Expected JSON, got ${type}`)
        }
        const history = await response.json();
        return history;
    } catch (error) {
        throw new Error(error.message);
    }
}

/**
 * This function retrieves the result of the last draw.
 * It sends a GET request to the server and returns a JSON object with the last draw numbers if available.
 * @returns {Promise} - A promise that resolves to the response JSON object.
 */
const getLastDraw = async () => {
    try {
        const response = await fetch(SERVER_URL + '/last-draw', {
            credentials: 'include'
        })
        if (!response.ok) {

            const errorData = await response.json();
            throw new Error(errorData.error)
        }
        let type = response.headers.get('Content-Type');
        if (type !== null && type.indexOf('application/json') === -1) {
            throw new TypeError(`Expected JSON, got ${type}`)
        }
        const lastDraw = await response.json();
        return lastDraw;
    } catch (error) {
        throw new Error(error.message);
    }
}

const getUser = async () => {
    try {
        const response = await fetch(SERVER_URL + '/userinfo', {
            credentials: 'include'
        })

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error)
        }
        let type = response.headers.get('Content-Type');
        if (type !== null && type.indexOf('application/json') === -1) {
            throw new TypeError(`Expected JSON, got ${type}`)
        }
        const user = await response.json();
        return user;

    } catch (error) {
        throw new Error(error.message);
    }
}



const API = { logIn, getUserInfo, logOut, addBet, getResult, getRemainingTime, getTopPlayers, getHistory, getLastDraw, getUser };
export default API;
