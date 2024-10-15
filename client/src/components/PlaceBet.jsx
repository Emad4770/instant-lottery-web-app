/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  Row,
  Toast,
} from "react-bootstrap";
import API from "../api/API";

function PlaceBet(props) {
  const [number1, setNumber1] = useState("");
  const [number2, setNumber2] = useState("");
  const [number3, setNumber3] = useState("");
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(false);
  const [variant, setVariant] = useState("danger");
  const drawnNumbers = props.lastDraw.numbers
    ? props.lastDraw.numbers.join(",")
    : "No numbers have been drawn yet.";

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Collect all values and filter out empty strings
    const values = [number1, number2, number3].filter((val) => val !== "");

    // Check if at least one field is filled
    if (values.length > 0) {
      // Check if all non-empty numbers are distinct
      if (new Set(values).size === values.length) {
        // Proceed with form submission
        try {
          const bet = await API.addBet(values);
          setMessage(
            "Successfully submitted!\n" +
              "Your Numbers are: " +
              bet.numbers.join(",")
          );
          setVariant("success");
          props.setCanSubmit(false);
          setShow(true);
        } catch (error) {
          setMessage(error.message);
          setVariant("danger");
          setShow(true);
        }

        // Handle form submission logic here
      } else {
        // Show an error message for non-distinct numbers
        setMessage("Please Make Sure All The Numbers Are Distinct.");
        setVariant("warning");
        setShow(true);
      }
    } else {
      // Show an error message if no fields are filled ; this is also handled by the required attribute in the form
      setMessage("Please fill at least one of the fields.");
      setVariant("warning");
      setShow(true);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Alert variant="secondary">
          <Alert.Heading>Last Draw Information: </Alert.Heading>
          <hr />
          <Row>
            <Col className="text-center">
              <strong>Draw Id: </strong>
              <br />
              {props.lastDraw.drawId}
            </Col>
            <Col className="text-center">
              <strong>Drawn Numbers: </strong>
              <br />
              {drawnNumbers}
            </Col>
            <Col className="text-center">
              <strong>Initiated Time: </strong>
              <br />
              {props.lastDraw.timestamp}
            </Col>
          </Row>
        </Alert>
      </Row>
      <Row className="justify-content-center">
        {props.userResult.error ? (
          <Alert variant="warning ">
            <Alert.Heading>No Results Available!</Alert.Heading>
            <hr />
            <p className="mb-0">{props.userResult.error}</p>
          </Alert>
        ) : (
          <Alert
            variant={
              props.userResult.result === "win"
                ? "success "
                : props.userResult.result === "lose"
                ? "danger"
                : props.userResult.result === "partial win"
                ? "primary"
                : "warning"
            }
          >
            <Alert.Heading>
              Results: You Have{" "}
              {props.userResult.result === "win"
                ? "Won "
                : props.userResult.result === "lose"
                ? "Lost "
                : props.userResult.result === "partial win"
                ? "Partially Won "
                : props.userResult.result}{" "}
              This Round!
            </Alert.Heading>

            <hr />
            <Row className="justify-content-center">
              <Col className="text-center">
                <strong>Draw Id: </strong>
                <br />
                {props.userResult.drawId}
              </Col>
              <Col className="text-center">
                <strong>Your Numbers: </strong>
                <br />
                {props.userResult.userNumbers?.join(",")}
              </Col>
              <Col className="text-center">
                <strong>Points Spent: </strong>
                <br />
                {props.userResult.pointsSpent}
              </Col>
              <Col className="text-center">
                <strong>Points Won: </strong>
                <br />
                {props.userResult.pointsWon}
              </Col>
              <Col className="text-center">
                <strong>Result: </strong>
                <br />
                {props.userResult.result}
              </Col>
              <Col className="text-center">
                <strong>Drawn Numbers: </strong>
                <br />
                {props.userResult.drawnNumbers?.join(",")}
              </Col>
              <Col className="text-center">
                <strong>Total Points: </strong>
                <br />
                {props.userResult.totalPoints}
              </Col>
            </Row>
          </Alert>
        )}
      </Row>

      <Row className="justify-content-md-center">
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Number 1</Form.Label>
                <Form.Control
                  type="number"
                  className="large-input"
                  max={90}
                  min={1}
                  value={number1}
                  required={number1 === "" && number2 === "" && number3 === ""}
                  onChange={(e) => setNumber1(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Number 2</Form.Label>
                <Form.Control
                  type="number"
                  className="large-input"
                  max={90}
                  min={1}
                  value={number2}
                  required={number1 === "" && number2 === "" && number3 === ""}
                  onChange={(e) => setNumber2(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Number 3</Form.Label>
                <Form.Control
                  type="number"
                  className="large-input"
                  max={90}
                  min={1}
                  value={number3}
                  required={number1 === "" && number2 === "" && number3 === ""}
                  onChange={(e) => setNumber3(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md={4} className="d-grid">
              <Button
                className="mt-3 2-100"
                type="submit"
                disabled={!props.canSubmit}
              >
                Submit
              </Button>
            </Col>
          </Row>
        </Form>
      </Row>
      <br />
      {/* <Row className="justify-content-center">
        <Col md={8}>
          <Alert
            dismissible
            show={show}
            onClose={() => setShow(false)}
            variant={variant}
          >
            {message}
          </Alert>
        </Col>
      </Row> */}
      <Row className="justify-content-center">
        <Col md={8}>
          <Toast
            onClose={() => setShow(false)}
            show={show}
            delay={6000} // Auto-hide after 6 seconds
            autohide
            bg={variant} // Use the variant for background color
          >
            <Toast.Header closeButton>
              <strong className="me-auto">Status</strong>
            </Toast.Header>
            <Toast.Body>{message}</Toast.Body>
          </Toast>
        </Col>
      </Row>
    </Container>
  );
}

export default PlaceBet;
