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

export const GroupController = {
  create,
};
