import { ChatMessage } from "../models/index.js";
import { io } from "../utils/index.js";
//send messsage
const send = (req, res) => {
  const { chat_id, message } = req.body;
  const { user_id } = req.user;

  const chat_message = new ChatMessage({
    chat: chat_id,
    user: user_id,
    message,
    type: "TEXT",
  });

  chat_message.save(async (error) => {
    if (error) {
      res.status(400).send({ msg: "Error ao enviar a mensagem" });
    } else {
      const data = await chat_message.populate("user");
      io.sockets.in(chat_id).emit("message", data); //todos os usuarios data
      io.sockets.in(`${chat_id}_notify`).emit("message_notify", data);
      res.status(201).send({});
    }
  });
};

export const ChatMessageController = {
  send,
};
