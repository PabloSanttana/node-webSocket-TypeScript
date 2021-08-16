import { Socket } from "socket.io";
import { io } from "../http";
import { ConnectionsServices } from "../services/ConnectionsServices";
import { MessagesServices } from "../services/MessagesServices";

io.on("connect", async (socket: Socket) => {
  console.log("ADm: ", socket.id);
  const connectionsServices = new ConnectionsServices();
  const messagesService = new MessagesServices();

  const allConnectionsWithoutAdmin =
    await connectionsServices.findAllWthoutAdmin();

  io.emit("admin_list_all_users", allConnectionsWithoutAdmin);

  socket.on("admin_list_messages_by_user", async (params, callback) => {
    const { user_id } = params;

    const allMessages = await messagesService.listByUser(user_id);

    callback(allMessages);
  });

  socket.on("admin_send_message", async (params, callback) => {
    const { user_id, text } = params;

    await messagesService.create({
      text,
      user_id,
      admin_id: socket.id,
    });

    const { socket_id } = await connectionsServices.findByUserId(user_id);

    io.to(socket_id).emit("admin_send_to_client", {
      text,
      socket_id: socket.id,
    });
  });

  socket.on("admin_user_in_support", async (params, callback) => {
    const { user_id } = params;

    await connectionsServices.updateAminId(user_id, socket.id);
    const allConnectionsWithoutAdmin =
      await connectionsServices.findAllWthoutAdmin();

    io.emit("admin_list_all_users", allConnectionsWithoutAdmin);
  });
});
