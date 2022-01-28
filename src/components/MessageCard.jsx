import React, { useState } from "react";

const MessageCard = ({ index, message, contract }) => {
  const [activeMessageIndex, setActiveMessageIndex] = useState(undefined);
  const [replyErrorMessage, setReplyErrorMessage] = useState("");
  const [deleteErrorMessage, setDeleteErrorMessage] = useState("");

  const submitReply = async (text) => {
    if (text.length < 1) return;
    try {
      await contract.addReply({ text, messageIndex: activeMessageIndex });
      window.location.reload();
    } catch {
      setReplyErrorMessage(
        "Sorry, only the contract owner can reply to messages."
      );
    }
  };

  const deleteMessage = async (messageIndex) => {
    try {
      await contract.deleteMessage({ messageIndex });
      window.location.reload();
    } catch {
      setDeleteErrorMessage(
        "Sorry, only the message author can delete this message."
      );
    }
  };

  return (
    <div className={`message-container ${message.premium ? "is-premium" : ""}`}>
      <p style={{ marginBottom: "0" }}>From: {message.sender}</p>
      <p style={{ marginTop: "0", marginBottom: "0" }}>
        Date: {message.timestamp}
      </p>
      {message.premium && (
        <p style={{ marginTop: "0", marginBottom: "0" }}>Added donation!</p>
      )}
      <p>
        <strong>{message.text}</strong>
      </p>
      <div className="message-actions">
        {message.reply ? (
          <Reply text={message.reply} />
        ) : (
          <button
            onClick={() =>
              setActiveMessageIndex(activeMessageIndex > -1 ? undefined : index)
            }
          >
            {activeMessageIndex > -1 ? "Close" : "Reply to this message"}
          </button>
        )}
        {activeMessageIndex > -1 ? (
          <Input
            submitReply={submitReply}
            replyErrorMessage={replyErrorMessage}
          />
        ) : null}
        <button
          style={{ marginTop: "10px" }}
          onClick={() => deleteMessage(index)}
        >
          Delete this message
        </button>
        {deleteErrorMessage.length > 0 && <p>{deleteErrorMessage}</p>}
      </div>
    </div>
  );
};

const Input = ({ submitReply, replyErrorMessage }) => {
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
      <button style={{ marginTop: "10px" }} onClick={(e) => submitReply(value)}>
        Submit reply
      </button>
      {replyErrorMessage.length > 0 && <p>{replyErrorMessage}</p>}
    </>
  );
};

const Reply = ({ text }) => {
  return <p className="reply-text">{`Reply from contract owner: "${text}"`}</p>;
};

export default MessageCard;
