import React, { useState } from "react";
import { BOATLOAD_OF_GAS, DONATION_VALUE } from "../App";

const MessageCard = ({ index, message, contract }) => {
  const [activeMessageIndex, setActiveMessageIndex] = useState(undefined);

  const submitReply = (text) => {
    if (text.length < 1) return;
    contract
      .addReply(
        { text, messageIndex: activeMessageIndex },
        BOATLOAD_OF_GAS,
        DONATION_VALUE
      )
      .then(() => {
        contract.getMessages().then(() => {
          setActiveMessageIndex(undefined);
        });
      });
  };

  return (
    <div className="message-container">
      <p className={message.premium ? "is-premium" : ""}>
        <strong>Message from: {message.sender}</strong>:<br />
        {`"${message.text}"`}
      </p>
      {/* TODO: implement timestamp */}
      <div className="message-reply">
        {message.reply ? (
          <Reply text={message.reply} />
        ) : (
          <button
            onClick={() =>
              setActiveMessageIndex(activeMessageIndex > -1 ? undefined : index)
            }
          >
            {activeMessageIndex > -1 ? "Close" : "Reply to this message?"}
          </button>
        )}
        {activeMessageIndex > -1 ? <Input submitReply={submitReply} /> : null}
      </div>
    </div>
  );
};

const Input = ({ submitReply }) => {
  const [value, setValue] = useState("");
  const onChange = (event) => {
    setValue(event.target.value);
  };
  return (
    <>
      <p className="highlight">
        <label htmlFor="reply">Reply:</label>
        <input
          autoComplete="off"
          autoFocus
          id="reply"
          value={value}
          onChange={onChange}
        />
      </p>
      <button style={{ marginTop: "10px" }} onClick={() => submitReply(value)}>
        Submit reply
      </button>
    </>
  );
};

const Reply = ({ text }) => {
  return (
    <>
      <p className="reply-text">Reply from contract owner:</p>
      <p className="reply-text">{`"${text}"`}</p>
    </>
  );
};

export default MessageCard;
