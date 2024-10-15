/* eslint-disable react-hooks/exhaustive-deps */
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";
import Header from "./components/Header.jsx";
import { Container, Toast, ToastBody } from "react-bootstrap/";
import { Route, Routes, Navigate } from "react-router-dom";
import { LoginForm } from "./components/Auth.jsx";
import { useEffect, useState } from "react";
import API from "./api/API.js";
import FeedbackContext from "./contexts/FeedbackContext.js";
import PlaceBet from "./components/PlaceBet.jsx";
import {
  DashboardLayout,
  NotFoundLayout,
} from "./components/DashboardLayout.jsx";
import PlayersTable from "./components/PlayersList.jsx";
import HistoryTable from "./components/History.jsx";
import UserInfo from "./components/UserInfo.jsx";

function App() {
  // This state is used to store the feedback message to be shown in the toast
  const [feedback, setFeedback] = useState("");

  const setFeedbackFromError = (err) => {
    let message = "";
    if (err.message) message = err.message;
    else message = "Unknown Error";
    setFeedback(message); // Assuming only one error message at a time
  };

  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [lastDraw, setLastDraw] = useState([]);
  const [userResult, setUserResult] = useState([]);
  const [time, setTime] = useState(0);
  const [canSubmit, setCanSubmit] = useState(true);

  // The items that will be displayed in the sidebar menu
  const items = {
    placebet: {
      label: "Place Bet",
      url: "/placebet",
    },
    topplayers: {
      label: "Top Players",
      url: "/topplayers",
    },

    history: {
      label: "History",
      url: "/history",
    },
    userinfo: {
      label: "User Info",
      url: "/userinfo",
    },
  };
  async function getTime() {
    try {
      //  fetch the remaining time from the server
      const { remainingTime } = await API.getRemainingTime();
      setTime(remainingTime);
      if (remainingTime < 0) {
        setCanSubmit(false);
      } else {
        setCanSubmit(true);
      }
    } catch (error) {
      // console.error(error);
      setFeedbackFromError(error);
    }
  }

  async function getLastDraw() {
    // fetch the last draw from the server
    try {
      const lastDraw = await API.getLastDraw();
      setLastDraw(lastDraw);
    } catch (error) {
      setFeedbackFromError(error);
    }
  }

  async function getUserResult() {
    try {
      // fetch the user result from the server
      const result = await API.getResult();
      setUserResult(result);
    } catch (error) {
      setFeedbackFromError(error);
    }
  }

  useEffect(() => {
    // Checking if the user is already logged-in
    // This useEffect is called only the first time the component is mounted (i.e., when the page is (re)loaded.)
    API.getUserInfo()
      .then((user) => {
        setLoggedIn(true);
        setUser(user); // here you have the user info, if already logged in
      })
      .catch((e) => {
        if (loggedIn)
          // printing error only if the state is inconsistent (i.e., the app was configured to be logged-in)
          setFeedbackFromError(e);
        setLoggedIn(false);
        setUser(null);
      });
  }, []);

  useEffect(() => {
    // this useEffect is called every time the user logs in to fetch the time, last draw and user result
    if (loggedIn) {
      getTime();
      getLastDraw();
      getUserResult();
    }
  }, [loggedIn]);

  useEffect(() => {
    const interval = setInterval(() => {
      // set an interval to update the time every second
      setTime((prev) => prev - 1); // decrement the time every second
      // we basically fetch twice, once when the time is 0 and once when the time is -1 to make sure we get the last draw and the user result
      if ((time == 0 || time == -1) && loggedIn) {
        //
        setCanSubmit(false);
        getLastDraw();
        getUserResult();
      }
      /** since the server has a delay of 5 seconds between rounds and the counter goes until -4 inclusive
       * we need to wait 5 seconds before fetching the time again
       * to make sure we get the timing right  */
      if (time <= -4 && time >= -6 && loggedIn) {
        getTime();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [time]);

  /**
   * This function handles the login process.
   * It requires a username and a password inside a "credentials" object.
   */
  const handleLogin = async (credentials) => {
    const user = await API.logIn(credentials);
    setUser(user);
    setLoggedIn(true);
    setFeedback("Welcome, " + user.name);
  };

  /**
   * This function handles the logout process.
   */
  const handleLogout = async () => {
    await API.logOut();
    // clean up everything
    setLoggedIn(false);
    setUser(null);
    setFeedback("Goodbye, " + user.name);
  };

  return (
    <FeedbackContext.Provider value={{ setFeedback, setFeedbackFromError }}>
      <div className="min-vh-100 d-flex flex-column">
        <Header
          // isSidebarExpanded={isSidebarExpanded}
          // setIsSidebarExpanded={setIsSidebarExpanded}
          logout={handleLogout}
          user={user}
          loggedIn={loggedIn}
        />
        <Container fluid className="flex-grow-1 d-flex flex-column">
          <Routes>
            <Route
              path="/"
              element={
                /* If the user is not logged-in, redirect to log-in form*/
                <DashboardLayout
                  filters={items}
                  loggedIn={loggedIn}
                  time={time}
                />
              }
            >
              <Route path="*" element={<NotFoundLayout />} />
              <Route
                index
                element={
                  !loggedIn ? (
                    <Navigate replace to="/login" />
                  ) : (
                    <>
                      <PlaceBet
                        time={time}
                        lastDraw={lastDraw}
                        userResult={userResult}
                        feedback={feedback}
                        canSubmit={canSubmit}
                        setCanSubmit={setCanSubmit}
                      />
                    </>
                  )
                }
              />
              <Route
                path="placebet"
                element={
                  !loggedIn ? (
                    <Navigate replace to="/login" />
                  ) : (
                    <Navigate replace to="/" />
                  )
                }
              />
              <Route
                path="topplayers"
                element={
                  !loggedIn ? (
                    <Navigate replace to="/login" />
                  ) : (
                    <PlayersTable />
                  )
                }
              />
              <Route
                path="history"
                element={
                  !loggedIn ? (
                    <Navigate replace to="/login" />
                  ) : (
                    <HistoryTable />
                  )
                }
              />
              <Route
                path="userinfo"
                element={
                  !loggedIn ? (
                    <Navigate replace to="/login" />
                  ) : (
                    <UserInfo user={user} setUser={setUser} />
                  )
                }
              />
            </Route>

            <Route
              path="/login"
              element={
                /* If the user is ALREADY logged-in, redirect to root */
                loggedIn ? (
                  <Navigate replace to="/" />
                ) : (
                  <LoginForm login={handleLogin} />
                )
              }
            />
          </Routes>
          <Toast
            show={feedback !== ""}
            autohide
            onClose={() => setFeedback("")}
            delay={4000}
            position="top-end"
            className="position-fixed end-0 m-3"
          >
            <ToastBody>{feedback}</ToastBody>
          </Toast>
        </Container>
      </div>
    </FeedbackContext.Provider>
  );
}

export default App;
