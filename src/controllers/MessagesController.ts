import { Response, Request } from "express";

import { MessagesServices } from "../services/MessagesServices";

class MessagesController {
  async create(request: Request, response: Response): Promise<Response> {
    const { admin_id, text, user_id } = request.body;

    const messagesService = new MessagesServices();

    try {
      const message = await messagesService.create({
        admin_id,
        text,
        user_id,
      });
      return response.status(200).json(message);
    } catch (error) {
      return response.status(400).json({
        message: error.message,
      });
    }
  }

  async showByUser(request: Request, response: Response): Promise<Response> {
    const { user_id } = request.params;
    const messagesService = new MessagesServices();

    const messages = await messagesService.listByUser(user_id);

    if (!messages) {
      return response.status(200).json({
        message: "not messages",
      });
    }

    return response.status(200).json(messages);
  }
}

export { MessagesController };
