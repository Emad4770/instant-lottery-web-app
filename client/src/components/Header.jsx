import PropTypes from "prop-types";
import { Col, Container, Row } from "react-bootstrap/";
import { LogoutButton, LoginButton } from "./Auth";

function Header(props) {
  return (
    <header className="py-1 py-md-3 border-bottom bg-primary">
      <Container fluid className="gap-3 align-items-center">
        <Row>
          <Col xs={4} md={4}>
            <a className="d-flex align-items-center justify-content-center justify-content-md-start h-100 link-light text-decoration-none">
              <i className="bi bi-cash-coin"></i>
              <span className="h5 mb-0"> Instant Lottery</span>
            </a>
          </Col>
          <Col
            xs={5}
            md={8}
            className="d-flex align-items-center justify-content-end"
          >
            {props.loggedIn && props.user?.name && (
              <span className="text-light me-3">
                Logged in as: {props.user.username}
              </span>
            )}
            <span className="ml-md-auto">
              {props.loggedIn ? (
                <LogoutButton logout={props.logout} />
              ) : (
                <LoginButton />
              )}
            </span>
          </Col>
        </Row>
      </Container>
    </header>
  );
}

Header.propTypes = {
  logout: PropTypes.func,
  user: PropTypes.object,
  loggedIn: PropTypes.bool,
};

export default Header;
