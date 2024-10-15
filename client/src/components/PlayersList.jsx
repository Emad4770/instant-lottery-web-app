import { useEffect, useState } from "react";
import { Table, Toast, ToastBody } from "react-bootstrap";
import PropTypes from "prop-types";
import API from "../api/API";

function PlayersTable() {
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const players = await API.getTopPlayers();
        setPlayers(players);
      } catch (error) {
        setError(error.message);
      }
    }
    fetchPlayers();
  }, []);

  return (
    <>
      <Toast
        show={error !== ""}
        autohide
        onClose={() => setError("")}
        delay={2000}
        position="top-center"
        className="position-fixed end-0 m-3"
      >
        <ToastBody>{error}</ToastBody>
      </Toast>
      <h1>Top Players</h1>
      <Table className="table-hover" striped id="film-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Name</th>
            <th>Total Points</th>
          </tr>
        </thead>
        <tbody>
          {/* {console.log(props.films)} */}
          {players.map((player) => (
            <PlayerRow player={player} key={player.id} />
          ))}
        </tbody>
      </Table>
    </>
  );
}

function PlayerRow(props) {
  return (
    <tr>
      <td>{props.player.username}</td>
      <td>{props.player.name}</td>
      <td>{props.player.points}</td>
    </tr>
  );
}

PlayerRow.propTypes = {
  player: PropTypes.shape({
    username: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    points: PropTypes.number.isRequired,
  }).isRequired,
};

export default PlayersTable;
