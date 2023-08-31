import { Group } from "../models/index.js";
import { getFilePath } from "../utils/image.js";

//criar um grupo
const create = (req, res) => {
  const { user_id } = req.user;
  const group = new Group(req.body);
  group.creator = user_id;
  //Recebe um vetor ["", ""] com id dos participantes do grupo req.body.participants e presisa do parse
  group.participants = JSON.parse(req.body.participants);
  group.participants = [...group.participants, user_id];
  if (req.files.image) {
    const imagePath = getFilePath(req.files.image);
    group.image = imagePath;
  }

  group.save((error, groupStorage) => {
    if (error) {
      res.status(500).send({ msg: "Error no servidor" });
    } else {
      if (!groupStorage) {
        res.status(400).send({ msg: "Error ao criar um grupo" });
      } else {
        res.status(201).send(groupStorage);
      }
    }
  });
};

//pega todos os grupos do usuario com id
const getAll = (req, res) => {
  const { user_id } = req.user;
  Group.find({ participants: user_id })
    .populate("creator")
    .populate("participants")
    .exec((error, groups) => {
      if (error) {
        res.status(500).send({ msg: "Error no servidor" });
      }

      res.status(200).send(groups);
    });
};

//pega o grupo com id
const getGroup = (req, res) => {
  const group_id = req.params.id;

  Group.findById(group_id, (error, groupStorage) => {
    if (error) {
      res.status(500).send({ msg: "Error no servidor" });
    } else if (!groupStorage) {
      res.status(400).send({ msg: "Não foi encontrado nenhum grupo" });
    } else {
      res.status(200).send(groupStorage);
    }
  }).populate("participants");
};

const updateGroup = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const group = await Group.findById(id);

  if (name) group.name = name; //verifica que o nome foi enviado

  //verifica se a imagem foi enviada
  if (req.files.image) {
    const imagePath = getFilePath(req.files.image);
    group.image = imagePath;
  }

  Group.findByIdAndUpdate(id, group, (error) => {
    if (error) {
      res.status(500).send({ msg: "Error no servidor" });
    } else {
      res.status(200).send({ image: group.image, name: group.name });
    }
  });
};

const exitGroup = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.user;

  const group = await Group.findById(id);

  //cria uma nova lista de participantes, sem o que saiu
  const newParticipants = group.participants.filter(
    (participant) => participant.toString() !== user_id
  );

  const newData = {
    ...group._doc,
    participants: newParticipants,
  };

  await Group.findByIdAndUpdate(id, newData);

  res.status(200).send({ msg: "Você saiu do grupo" });
};

export const GroupController = {
  create,
  getAll,
  getGroup,
  updateGroup,
  exitGroup,
};
