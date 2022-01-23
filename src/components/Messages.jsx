import React from "react";
import PropTypes from "prop-types";
import MessageCard from "./MessageCard";

export default function Messages({ messages, contract }) {
  return (
    <>
      <h2>Messages</h2>
      {messages.map((message, i) => (
        <MessageCard index={i} message={message} contract={contract} />
      ))}
    </>
  );
}

Messages.propTypes = {
  messages: PropTypes.array,
};
