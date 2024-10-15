
export default class createCountdown {

    // Constructor to initialize the countdown with the total seconds
    constructor(totalSeconds) {
        this.remainingTime = totalSeconds;
        this.intervalId = null;
    }

    // Start the countdown
    startCountdown() {
        this.intervalId = setInterval(() => {

            this.remainingTime--;

            if (this.remainingTime < -5) { // because we have a 5 seconds delay between rounds, so the counter goes until -4 inclusive
                clearInterval(this.intervalId);
            }
        }, 1000); // Update every second
    }

    // Function to get the current remaining time
    getRemainingTime() {


        return (this.remainingTime)

        /* if we want to return the time in the format mm:ss */

        // let minutes = Math.floor(this.remainingTime / 60);
        // let seconds = this.remainingTime % 60;
        // return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    // Function to stop the countdown
    stopCountdown() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }
}
