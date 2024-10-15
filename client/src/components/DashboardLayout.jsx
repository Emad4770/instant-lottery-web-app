/* eslint-disable react/prop-types */
import { Col, Row } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import Filters from "./Filters.jsx";
import Timer from "./Timer.jsx";

export function DashboardLayout(props) {
  return (
    <Row className="flex-grow-1">
      {props.loggedIn && (
        <Col id="films-filters" className="col-md-3 bg-light d-md-block">
          <Timer time={props.time} />

          <div className="py-4">
            <h5 className="mb-3">Menu</h5>
            <Filters items={props.filters} />
          </div>
        </Col>
      )}
      <Col className="pt-3">
        <Outlet />
      </Col>
    </Row>
  );
}

export function NotFoundLayout() {
  return (
    <>
      <Row className="justify-content-md-center">
        <Col className="text-center">
          <h2>Error: page not found!</h2>
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col className="d-flex justify-content-center">
          <img
            src="/GitHub404.png"
            alt="page not found"
            className="my-3"
            style={{ display: "block" }}
          />
        </Col>
      </Row>
      <Row>
        <Col className="text-center">
          {" "}
          <Link to="/" className="btn btn-primary mt-2 my-5">
            Go Home!
          </Link>{" "}
        </Col>
      </Row>
    </>
  );
}
