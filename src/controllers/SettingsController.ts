import { Response, Request } from "express";

import { SettingsServices } from "../services/SettingsServices";

class SettigsController {
  async create(request: Request, response: Response) {
    const { chat, username } = request.body;

    if (chat === undefined || !username) {
      return response.status(400).json({
        message: "Formulario incompleto",
      });
    }
    const settingsServices = new SettingsServices();

    try {
      const settings = await settingsServices.create({ chat, username });
      return response.status(200).json(settings);
    } catch (error) {
      return response.status(400).json({
        message: error.message,
      });
    }
  }
  async findByUsername(request: Request, response: Response) {
    const { username } = request.params;
    const settingsServices = new SettingsServices();

    try {
      const settings = await settingsServices.findByUsername(username);
      return response.status(200).json(settings);
    } catch (error) {
      return response.status(400).json({
        message: error.message,
      });
    }
  }
  async update(request: Request, response: Response) {
    const { username } = request.params;
    const { chat } = request.body;
    const settingsServices = new SettingsServices();

    try {
      const settings = await settingsServices.update(username, chat);
      return response.status(200).json(settings);
    } catch (error) {
      return response.status(400).json({
        message: error.message,
      });
    }
  }
}

export { SettigsController };
