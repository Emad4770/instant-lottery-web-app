/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Table, Toast, ToastBody } from "react-bootstrap";
import API from "../api/API";

function HistoryTable() {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchHistory() {
      try {
        const history = await API.getHistory();
        setHistory(history);
      } catch (error) {
        setError(error.message);
      }
    }
    fetchHistory();
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
      <h1>Your Betting History</h1>
      <Table className="table-hover" striped id="film-table">
        <thead>
          <tr>
            <th>Draw Id</th>
            <th>Bet Numbers</th>
            <th>Spent Points</th>
            <th>Gained Points</th>
            <th>Result</th>
            <th>Drawn Numbers</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {/* {console.log(props.films)} */}
          {history.map((history) => (
            <HistoryRow history={history} key={history.id} />
          ))}
        </tbody>
      </Table>
    </>
  );
}

function HistoryRow(props) {
  return (
    <tr>
      <td>{props.history.draw_id}</td>
      <td>{props.history.numbers}</td>
      <td>{props.history.points_spent}</td>
      <td>{props.history.points_won}</td>
      <td>{props.history.result}</td>
      <td>{props.history.drawn_numbers}</td>
      <td>{props.history.timestamp}</td>
    </tr>
  );
}

export default HistoryTable;
