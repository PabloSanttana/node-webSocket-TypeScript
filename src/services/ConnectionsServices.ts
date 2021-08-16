import { getCustomRepository, Repository } from "typeorm";

import { Connection } from "../entities/Connection";
import { ConnetionsRepository } from "../repositories/ConnetionsRepository";

interface IConnectionCreate {
  admin_id?: string;
  user_id: string;
  socket_id: string;
  id?: string;
}

class ConnectionsServices {
  private connectionsRepository: Repository<Connection>;

  constructor() {
    this.connectionsRepository = getCustomRepository(ConnetionsRepository);
  }

  async create({ admin_id, socket_id, user_id, id }: IConnectionCreate) {
    const connection = this.connectionsRepository.create({
      admin_id,
      user_id,
      socket_id,
      id,
    });

    try {
      await this.connectionsRepository.save(connection);

      return connection;
    } catch (error) {
      console.log(error.message);
      throw new Error("Erro no servidor, tente novamente mais tarde.");
    }
  }
  async findByUserId(user_id: string) {
    const connection = await this.connectionsRepository.findOne({ user_id });

    return connection;
  }
  async findAllWthoutAdmin() {
    const connection = await this.connectionsRepository.find({
      where: { admin_id: null },
      relations: ["user"],
    });

    return connection;
  }

  async findBySocketID(socket_id: string) {
    const connection = await this.connectionsRepository.findOne({ socket_id });

    return connection;
  }

  async updateAminId(user_id: string, admin_id: string) {
    await this.connectionsRepository
      .createQueryBuilder()
      .update(Connection)
      .set({ admin_id })
      .where("user_id = :user_id", {
        user_id,
      })
      .execute();
  }
  async deleteBySocketId(socket_id: string) {
    await this.connectionsRepository
      .createQueryBuilder()
      .delete()
      .where("socket_id = :socket_id", {
        socket_id,
      })
      .execute();
  }
}

export { ConnectionsServices };
