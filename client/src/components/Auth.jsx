import { useState } from "react";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

function LoginForm(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [show, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const credentials = { username, password };

    props
      .login(credentials)
      .then(() => navigate("/"))
      .catch((err) => {
        if (err.message === "Unauthorized")
          setErrorMessage("Invalid username and/or password");
        else setErrorMessage(err.message);
        setShow(true);
      });
  };

  return (
    <Row className="mt-3 vh-100 justify-content-md-center">
      <Col md={4}>
        <Alert variant="primary">
          <Alert.Heading>Instant Lottery Game Rules:</Alert.Heading>
          <hr />
          <p className="mb-0">
            Every 2 minutes, 5 distinct numbers (1-90) are drawn and shown to
            all players. Before the draw, players can bet on 1, 2, or 3 numbers.
            Each bet costs points (5 for 1 number, 10 for 2, 15 for 3). Players
            start with 100 points and can bet if they have enough. Winning bets
            increase points; if a player runs out, they can not bet.
          </p>
          <div className="mb-0">
            Bet outcomes:
            <ul>
              <li>All numbers correct: player wins 2x the points spent.</li>
              <li>No numbers correct: no points won.</li>
              <li>
                Some correct: player wins proportional points, calculated as 2 *
                (spent points) * (correct numbers) / (played numbers).
              </li>
            </ul>
          </div>
        </Alert>
      </Col>

      <Col md={4}>
        <h1 className="pb-3">Login</h1>
        <Form onSubmit={handleSubmit}>
          <Alert
            dismissible
            show={show}
            onClose={() => setShow(false)}
            variant="danger"
          >
            {errorMessage}
          </Alert>
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>email</Form.Label>
            <Form.Control
              type="email"
              value={username}
              placeholder="Example: john@hi.com"
              onChange={(ev) => setUsername(ev.target.value)}
              required={true}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              placeholder="Enter the password."
              onChange={(ev) => setPassword(ev.target.value)}
              required={true}
              minLength={6}
            />
          </Form.Group>
          <Button className="mt-3" type="submit">
            Login
          </Button>
        </Form>
      </Col>
    </Row>
  );
}

LoginForm.propTypes = {
  login: PropTypes.func,
};

function LogoutButton(props) {
  return (
    <Button variant="outline-light" onClick={props.logout}>
      Logout
    </Button>
  );
}

LogoutButton.propTypes = {
  logout: PropTypes.func,
};

function LoginButton() {
  const navigate = useNavigate();
  return (
    <Button variant="outline-light" onClick={() => navigate("/login")}>
      Login
    </Button>
  );
}

export { LoginForm, LogoutButton, LoginButton };
