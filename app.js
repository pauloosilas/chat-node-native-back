import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import { initSocketServer } from "./utils/index.js";
import {
  authRoutes,
  userRoutes,
  chatRoutes,
  chatMessageRoutes,
} from "./routes/index.js";

const app = express();
const server = http.createServer(app);

initSocketServer(server);

/*
app.listen(8080, () => {
  console.log(`server in http://localhost:${port}`);
});
*/

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static("uploads"));

app.use(cors());

app.use(morgan("dev"));

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", chatRoutes);
app.use("/api", chatMessageRoutes);
export { server };
