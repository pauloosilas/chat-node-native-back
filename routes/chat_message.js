import express from "express";
import multiparty from "connect-multiparty";
import { ChatMessageController } from "../controllers/index.js";
import { mdAuth } from "../middlewares/index.js";

const mdUpload = multiparty({ uploadDir: "./uploads/images" });
const api = express.Router();

api.post("/chat/message", [mdAuth.asureAuth], ChatMessageController.send);

export const chatMessageRoutes = api;
