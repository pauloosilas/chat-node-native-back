import { GroupMessage } from "../models/index.js";
import { io, getFilePath } from "../utils/index.js";

//envia mensagem de texto para o grupo
const sendText = (req, res) => {
  const { group_id, message } = req.body;
  const { user_id } = req.user;

  const group_message = new GroupMessage({
    group: group_id,
    user: user_id,
    message,
    type: "TEXT",
  });

  group_message.save(async (error) => {
    if (error) {
      res.status(500).send({ msg: "Error no servidor" });
    } else {
      const data = await group_message.populate("user"); //popula data com a mensagem e dados do usuario
      io.sockets.in(group_id).emit("message", data); // emite a todos os participantes do group_id
      io.sockets.in(`${group_id}_notify`).emit("message_notify", data);
      res.status(201).send({});
    }
  });
};
//envia imagem para o grupo
const sendImage = (req, res) => {
  const { group_id } = req.body;
  const { user_id } = req.user;

  const group_message = new GroupMessage({
    group: group_id,
    user: user_id,
    message: getFilePath(req.files.image),
    type: "IMAGE",
  });

  group_message.save(async (error) => {
    if (error) {
      res.status(500).send({ msg: "Error no servidor" });
    } else {
      const data = await group_message.populate("user"); //popula data com a mensagem e dados do usuario
      io.sockets.in(group_id).emit("message", data); // emite a todos os participantes do group_id
      io.sockets.in(`${group_id}_notify`).emit("message_notify", data);
      res.status(201).send({});
    }
  });
};

//Pegar todas as mensagens do grupo
const getAll = async (req, res) => {
  const { group_id } = req.params;

  try {
    const messages = await GroupMessage.find({ group: group_id })
      .sort({
        createdAt: 1,
      })
      .populate("user");

    const total = messages.length;

    res.status(200).send({ messages, total });
  } catch (error) {
    res.status(500).send({ msg: "Error no servidor" });
  }
};

//pegar o total de mensagens
const getTotalMessages = async (req, res) => {
  const { group_id } = req.params;

  try {
    const total = await GroupMessage.find({ group: group_id }).count();
    res.status(200).send(JSON.stringify(total));
  } catch (error) {
    res.status(500).send({ msg: "Error no servidor" });
  }
};

//obter ultima mensagem enviada ao grupo
const getLastMessage = async (req, res) => {
  const { group_id } = req.params;

  try {
    const response = await GroupMessage.findOne({ group: group_id })
      .sort({
        createdAt: -1,
      })
      .populate("user");
    res.status(200).send(response || {});
  } catch (error) {
    res.status(500).send({ msg: "Error no servidor" });
  }
};

export const GroupMessageController = {
  sendText,
  sendImage,
  getAll,
  getTotalMessages,
  getLastMessage,
};
