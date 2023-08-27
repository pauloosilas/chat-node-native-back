import { User } from "../models/index.js";
import { getFilePath } from "../utils/index.js";
//pegar somente meu usuario
const getMe = async (req, res) => {
  const { user_id } = req.user;

  try {
    const response = await User.findById(user_id).select(["-password"]);

    if (!response) {
      res.status(400).send({ msg: "Usuário não encontrado" });
    } else {
      res.status(200).send(response);
    }
  } catch (error) {
    res.status(500).send({ msg: "Erro no servidor" });
  }
};
//pegar todos os usuarios
const getUsers = async (req, res) => {
  try {
    const { user_id } = req.user;
    //busca por todos os usuários, menos o do proprio usuario logado
    const users = await User.find({ _id: { $ne: user_id } }).select([
      "-password",
    ]);

    if (!users) {
      res.status(400).send({ msg: "Nenhum usuário encontrado" });
    } else {
      res.status(200).send(users);
    }
  } catch (error) {
    res.status(500).send({ msg: "Error no servidor" });
  }
};
// pegar um usuario com id
const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const response = await User.findById(id).select(["-password"]);

    if (!response) {
      res.status(400).send({ msg: "usuário não encontrado" });
    } else {
      res.status(200).send(response);
    }
  } catch (error) {
    res.status(500).send({ msg: "Error no servidor" });
  }
};

//Atualizar meu perfil
const updateUser = async (req, res) => {
  const { user_id } = req.user;
  const userData = req.body;

  //console.log(req.files)
  if (req.files.avatar) {
    const imagePath = getFilePath(req.files.avatar);
    userData.avatar = imagePath;
  }

  User.findByIdAndUpdate({ _id: user_id }, userData, (error) => {
    if (error) {
      res.status(400).send({ msg: "Error ao atualizar o usuário" });
    } else {
      res.status(200).send(userData);
    }
  });
};

export const UserController = {
  getMe,
  getUsers,
  getUser,
  updateUser,
};
