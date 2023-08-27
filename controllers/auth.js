import { User } from "../models/index.js";
import bcrypt from "bcryptjs";
import { jwt } from "../utils/index.js";

const register = (req, res) => {
  const { email, password } = req.body;
  const user = new User({
    email: email.toLowerCase(),
    password: password,
  });

  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(password, salt);
  user.password = hashPassword;

  user.save((error, userStorage) => {
    if (error) {
      res.status(400).send({ msg: "Error al registrar o usuario" });
    } else {
      res.status(201).send(userStorage);
    }
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  const emailLowerCase = email.toLowerCase();

  User.findOne({ email: emailLowerCase }, (error, userStorage) => {
    if (error) {
      res.status(500).send({ msg: "Error no servidor" });
    } else {
      bcrypt.compare(password, userStorage.password, (bcryptError, check) => {
        if (bcryptError) {
          res.status(500).send({ msg: "Error no servidor" });
        } else if (!check) {
          res.status(400).send({ msg: "senha incorreta" });
        } else {
          res.status(200).send({
            access: jwt.createAccessToken(userStorage),
            refresh: jwt.createRefreshToken(userStorage),
          });
        }
      });
    }
  });
};

const refreshAccessToken = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) res.status(400).send({ mgs: "Token requerido" });

  const hasExpired = jwt.hasExpiredToken(refreshToken);

  if (hasExpired) res.status(400).send({ msg: "token expirado" });

  const { user_id } = jwt.decoded(refreshToken);

  User.findById(user_id, (error, userStorage) => {
    if (error) {
      res.status(500).send({ msg: "Error no servidor" });
    } else {
      res.status(200).send({
        accessToken: jwt.createAccessToken(userStorage),
      });
    }
  });
};

export const AuthController = {
  register,
  login,
  refreshAccessToken,
};
