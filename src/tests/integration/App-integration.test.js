// these are made available by near-cli/test_environment
// note: do not remove the line below as it is needed for these tests
/* global nearlib, nearConfig */

import "regenerator-runtime/runtime";

let near;
let contract;
let accountId;

beforeAll(async function () {
  near = await nearlib.connect(nearConfig);
  accountId = nearConfig.contractName;
  contract = await near.loadContract(nearConfig.contractName, {
    viewMethods: ["getMessages"],
    changeMethods: ["addMessage", "addReply", "deleteMessage"],
    sender: accountId,
  });
});

it("send one message and retrieve it", async () => {
  await contract.addMessage({ text: "aloha", timestamp: "28/01/2022" });
  const msgs = await contract.getMessages();
  const expectedMessagesResult = [
    {
      premium: false,
      reply: "",
      sender: accountId,
      text: "aloha",
      timestamp: "28/01/2022",
    },
  ];
  expect(msgs).toEqual(expectedMessagesResult);
});

it("send two more messages and expect three total", async () => {
  jest.setTimeout.Timeout = 10000;
  await contract.addMessage({ text: "foo", timestamp: "28/01/2022" });
  await contract.addMessage({ text: "bar", timestamp: "28/01/2022" });
  const msgs = await contract.getMessages();
  expect(msgs.length).toEqual(3);
});
