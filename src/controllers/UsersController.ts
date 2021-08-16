import { Request, Response } from "express";

import { UsersServices } from "../services/UsersServices";

class UsersController {
  async create(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;

    if (email === undefined || email === "") {
      return response.status(400).json({
        message: "Formulario incompleto",
      });
    }

    const usersServices = new UsersServices();

    try {
      const user = await usersServices.create(email);
      return response.status(200).json(user);
    } catch (error) {
      return response.status(400).json({
        message: error.message,
      });
    }
  }
}

export { UsersController };
