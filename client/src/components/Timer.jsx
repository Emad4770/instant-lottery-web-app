import PropTypes from "prop-types";

const Timer = ({ time }) => {
  // display the time remaining in the format MM:SS
  return time <= 0 ? (
    <h3>Waiting for the next round</h3>
  ) : (
    <div className="timer">
      <h3>
        Time Remaining:{" "}
        {Math.floor(time / 60)
          .toString()
          .padStart(2, "0")}
        :{(time % 60).toString().padStart(2, "0")}
      </h3>
    </div>
  );
};

Timer.propTypes = {
  time: PropTypes.number.isRequired,
};

export default Timer;
