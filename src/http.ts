import express, { json } from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import path from "path";

import "./database";
import { routes } from "./routes";

const app = express();

app.use(express.static(path.join(__dirname, "..", "public")));
app.set("views", path.join(__dirname, "..", "public"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.get("/pages/cleint", (request, response) => {
  return response.render("html/client.html");
});
app.get("/pages/admin", (request, response) => {
  return response.render("html/admin.html");
});

const http = createServer(app); // criando protocolo http
const io = new Server(http); // crriando protocolo ws

io.on("connection", (socket: Socket) => {
  console.log(socket.id);
});

app.use(json());
app.use(routes);

export { http, io };
