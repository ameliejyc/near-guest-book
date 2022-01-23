import { Context } from "near-sdk-as";
import { PostedMessage, messages } from "./model";

// The maximum number of latest messages the contract returns.
const MESSAGE_LIMIT = 10;

/**
 * Adds a new message under the name of the sender's account id.\
 * NOTE: This is a change method. Which means it will modify the state.\
 * But right now we don't distinguish them with annotations yet.
 */
export function addMessage(text: string): void {
  // Creating a new message and populating fields with our data
  const message = new PostedMessage(text);
  // Adding the message to end of the persistent collection
  messages.push(message);
}

/**
 * Returns an array of last N messages.\
 * NOTE: This is a view method. Which means it should NOT modify the state.
 */
export function getMessages(): PostedMessage[] {
  const numMessages = min(MESSAGE_LIMIT, messages.length);
  const startIndex = messages.length - numMessages;
  const result = new Array<PostedMessage>(numMessages);
  for (let i = 0; i < numMessages; i++) {
    result[i] = messages[i + startIndex];
  }
  return result;
}

/**
 * Adds a reply to a message from the contract owner.\
 * NOTE: This is a change method. Which means it will modify the state.\
 */
export function addReply(text: string, messageIndex: i32): void {
  const caller = Context.predecessor;
  const owner = Context.contractName;
  assert(
    owner == caller,
    "Only the owner of this contract may call this method"
  );
  const messageToReplyTo: PostedMessage = messages[messageIndex];
  assert(!messageToReplyTo.reply, "This message already has one reply");
  messageToReplyTo.addReply(text);
  messages.replace(messageIndex, messageToReplyTo);
}
