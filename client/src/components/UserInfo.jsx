/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Card, Col, ListGroup, Row } from "react-bootstrap";
import API from "../api/API";
import { useEffect } from "react";
import FeedbackContext from "../contexts/FeedbackContext";
import { useContext } from "react";

function UserInfo({ user, setUser }) {
  const { setFeedbackFromError } = useContext(FeedbackContext);

  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await API.getUser();
        setUser(user);
      } catch (error) {
        setFeedbackFromError(error);
      }
    }
    fetchUser();
  }, []);

  return (
    <Row className="mt-3 vh-100 justify-content-md-center">
      <Col md={4}>
        <Card style={{ width: "18rem" }} className="mb-3">
          <Card.Header as="h5">User Information</Card.Header>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <strong>Username:</strong> {user.username}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Name:</strong> {user.name}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Points:</strong> {user.points}
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
}

export default UserInfo;
