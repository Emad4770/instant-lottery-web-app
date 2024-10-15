/* eslint-disable no-unused-vars */
import React from "react";

const FeedbackContext = React.createContext({
    setFeedback: (message) => { },
    setFeedbackFromError: (error) => { }
});

export default FeedbackContext;