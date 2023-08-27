import { server } from "./app.js";
import mongoose from "mongoose";
import { IP_SERVER, PORT, DB_HOST, DB_PASSWORD, DB_USER } from "./constants.js";
import { io } from "./utils/index.js";

const mongoDbUrl = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/`;
mongoose.connect(mongoDbUrl, (error) => {
  if (error) throw error;

  server.listen(PORT, () => {
    console.log("***********  API  ***********");
    console.log(`http://${IP_SERVER}/${PORT}/api`);

    io.sockets.on("connection", (socket) => {
      console.log("Novo usuario conectado no App...");

      socket.on("disconnect", () => {
        console.log("usuario desconectado...");
      });

      socket.on("subscribe", (room) => {
        socket.join(room);
      });

      socket.io("unsubscribe", (room) => {
        socket.leave(room);
      });
    });
  });
});
