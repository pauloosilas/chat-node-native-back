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
    .populate("participant_tow")
    .exec(async (error, chats) => {
      if (error) {
        return res.status(400).send({ msg: "Error ao obter chats" });
      }

      //Obter ultima mensagem de cada chat

      res.status(200).send(chats);
    });
};

export const ChatController = {
  create,
  getAll,
};
