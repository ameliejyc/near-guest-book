import { addMessage, deleteMessage, getMessages } from "../main";
import { PostedMessage, messages } from "../model";
import { VMContext, Context, u128 } from "near-sdk-as";

function createMessage(text: string, timestamp: string): PostedMessage {
  return new PostedMessage(text, timestamp);
}

const message = createMessage("hello world", "28/01/2022");

describe("message tests", () => {
  afterEach(() => {
    while (messages.length > 0) {
      messages.pop();
    }
  });

  it("adds a message", () => {
    addMessage("hello world", "28/01/2022");
    expect(messages.length).toBe(1, "should only contain one message");
    expect(messages[0]).toStrictEqual(
      message,
      'message should be "hello world"'
    );
  });

  it("adds a premium message", () => {
    VMContext.setAttached_deposit(u128.from("10000000000000000000000"));
    addMessage("hello world", "28/01/2022");
    const messageAR = getMessages();
    expect(messageAR[0].premium).toStrictEqual(true, "should be premium");
  });

  it("retrieves messages", () => {
    addMessage("hello world", "28/01/2022");
    const messagesArr = getMessages();
    expect(messagesArr.length).toBe(1, "should be one message");
    expect(messagesArr).toIncludeEqual(
      message,
      "messages should include:\n" + message.toJSON()
    );
  });

  it("only show the last 10 messages", () => {
    addMessage("hello world", "28/01/2022");
    const newMessages: PostedMessage[] = [];
    for (let i: i32 = 0; i < 10; i++) {
      const text = "message #" + i.toString();
      const timestamp = "28/01/2022".concat(i.toString());
      newMessages.push(createMessage(text, timestamp));
      addMessage(text, timestamp);
    }
    const messages = getMessages();
    log(messages.slice(7, 10));
    expect(messages).toStrictEqual(
      newMessages,
      "should be the last ten messages"
    );
    expect(messages).not.toIncludeEqual(
      message,
      "shouldn't contain the first element"
    );
  });

  it("deletes a message if made by author", () => {
    VMContext.setPredecessor_account_id("bob");
    addMessage("hello world", "28/01/2022");
    let messagesArr = getMessages();
    expect(messagesArr.length).toBe(1, "should be one message");
    deleteMessage(0);
    messagesArr = getMessages();
    expect(messagesArr.length).toBe(0, "should be zero messages");
    expect(messages).not.toIncludeEqual(
      message,
      "shouldn't contain any messages"
    );
  });
});

describe("attached deposit tests", () => {
  beforeEach(() => {
    VMContext.setAttached_deposit(u128.fromString("0"));
    VMContext.setAccount_balance(u128.fromString("0"));
  });

  it("attaches a deposit to a contract call", () => {
    log("Initial account balance: " + Context.accountBalance.toString());

    addMessage("hello world", "28/01/2022");
    VMContext.setAttached_deposit(u128.from("10"));

    log("Attached deposit: 10");
    log("Account balance after deposit: " + Context.accountBalance.toString());

    expect(Context.accountBalance.toString()).toStrictEqual(
      "10",
      "balance should be 10"
    );
  });
});
