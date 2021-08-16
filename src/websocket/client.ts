import { Socket } from "socket.io";

import { io } from "../http";
import { ConnectionsServices } from "../services/ConnectionsServices";
import { UsersServices } from "../services/UsersServices";
import { MessagesServices } from "../services/MessagesServices";

io.on("connect", (socket: Socket) => {
  const connectionsServices = new ConnectionsServices();
  const usersServices = new UsersServices();
  const messagesServices = new MessagesServices();
  socket.on("client_first_access", async (params) => {
    const socket_id = socket.id;
    const { text, email } = params;
    let user_id = null;

    const userExists = await usersServices.findByEmail(email);

    if (!userExists) {
      const user = await usersServices.create(email);

      await connectionsServices.create({
        socket_id,
        user_id: user.id,
      });
      user_id = user.id;
    } else {
      const connect = await connectionsServices.findByUserId(userExists.id);

      if (!connect) {
        await connectionsServices.create({
          socket_id,
          user_id: userExists.id,
        });
      } else {
        // faz um tipo ed update da conceção
        connect.socket_id = socket_id;
        await connectionsServices.create(connect);
      }
      user_id = userExists.id;
    }
    await messagesServices.create({ text, user_id });
    console.log(params);

    const allMessages = await messagesServices.listByUser(user_id);

    socket.emit("client_list_all_messages", allMessages);

    const allUsers = await connectionsServices.findAllWthoutAdmin();
    io.emit("admin_list_all_users", allUsers);
  });

  socket.on("client_send_to_admin", async (params) => {
    const { text, socket_admin_id } = params;
    console.log("client_send_to_admin", socket_admin_id);

    const { user_id } = await connectionsServices.findBySocketID(socket.id);

    const message = await messagesServices.create({
      text,
      user_id,
    });

    io.to(socket_admin_id).emit("admin_receive_message", {
      message,
      socket_id: socket.id,
    });
  });
  socket.on("disconnect", async () => {
    console.log(socket.id);
    await connectionsServices.deleteBySocketId(socket.id);
  });
});
