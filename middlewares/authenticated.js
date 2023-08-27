import { jwt } from "../utils/index.js";

const asureAuth = (req, res, next) => {
  if (!req.headers.authorization)
    return res.status(403).send({ msg: "Sem token de authorização" });

  const token = req.headers.authorization.replace("Bearer ", "");

  try {
    const hasExpired = jwt.hasExpiredToken(token);
    if (hasExpired) {
      return res.status(400).send({ msg: "Token expirado" });
    }

    const payload = jwt.decoded(token);
    req.user = payload;
  } catch (error) {
    return res.status(400).send({ msg: "Token invalido" + error });
  }

  next();
};

export const mdAuth = {
  asureAuth,
};
