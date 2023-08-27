import { Chat } from "../models/index.js";

const create = async (req, res) => {
  const { participant_id_one, participant_id_two } = req.body;

  const foundOne = await Chat.findOne({
    participant_one: participant_id_one,
    participant_two: participant_id_two,
  });

  const foundTwo = await Chat.findOne({
    participant_one: participant_id_two,
    participant_two: participant_id_one,
  });

  if (foundOne || foundTwo) {
    res.status(200).send({ msg: "Já tem um chat criado com este usuario" });
    return;
  }

  const chat = new Chat({
    participant_one: participant_id_one,
    participant_two: participant_id_two,
  });

  chat.save((error, chatStorage) => {
    if (error) {
      res.status(400).send({ msg: "Error ao criar um novo chat" });
    } else {
      res.status(201).send(chatStorage);
    }
  });
};

const getAll = (req, res) => {
  const { user_id } = req.user;
  Chat.find({
    $or: [{ participant_one: user_id }, { participant_two: user_id }],
  })
    .populate("participant_one")
    .populate("participant_two")
    .exec(async (error, chats) => {
      if (error) {
        return res.status(400).send({ msg: "Error ao obter chats" });
      }

      //Obter ultima mensagem de cada chat

      res.status(200).send(chats);
    });
};

const deleteChat = async (req, res) => {
  const chat_id = req.params.id;

  Chat.findByIdAndDelete(chat_id, (error) => {
    if (error) {
      res.status(400).send({ msg: "Error ao remover o chat" });
    } else {
      res.status(200).send({ msg: "chart removido" });
    }
  });
};

const getChat = async (req, res) => {
  const chat_id = req.params.id;
  Chat.findById(chat_id, (error, chatStorage) => {
    if (error) {
      res.status(400).send({ msg: "Error: Não foi possivel obter o chat" });
    } else {
      res.status(200).send(chatStorage);
    }
  })
    .populate("participant_one")
    .populate("participant_two");
};

export const ChatController = {
  create,
  getAll,
  deleteChat,
  getChat,
};
