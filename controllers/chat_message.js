import { ChatMessage } from "../models/index.js";
import { io } from "../utils/index.js";
import { getFilePath } from "../utils/index.js";

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

const sendImage = (req, res) => {
  const { chat_id } = req.body;
  const { user_id } = req.user;

  const chat_message = new ChatMessage({
    chat: chat_id,
    user: user_id,
    message: getFilePath(req.files.image),
    type: "IMAGE",
  });

  chat_message.save(async (error) => {
    if (error) {
      res.status(400).send({ msg: "Error ao enviar a imagem" });
    } else {
      const data = await chat_message.populate("user");
      io.sockets.in(chat_id).emit("message", data); //emit para todos os usuarios data
      io.sockets.in(`${chat_id}_notify`).emit("message_notify", data);
      res.status(400).send({});
    }
  });
};

const getAll = async (req, res) => {
  // pega todas as mensagens do chat com o ID
  const { chat_id } = req.params;

  try {
    const messages = await ChatMessage.find({ chat: chat_id })
      .sort({
        createdAt: 1,
      })
      .populate("user");
    // const total = await ChatMessage.find({ chat: chat_id }).count();
    const total = messages.length;

    res.status(200).send({ messages, total });
  } catch (error) {
    res.status(500).send({ msg: "Error no servidor" });
  }
};

export const ChatMessageController = {
  send,
  sendImage,
  getAll,
};
