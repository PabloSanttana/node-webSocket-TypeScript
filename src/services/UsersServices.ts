import { getCustomRepository, Repository } from "typeorm";
import { User } from "../entities/User";

import { UsersRepository } from "../repositories/UsersRepository";

interface IUsersCreate {
  email: string;
}

class UsersServices {
  private usersRepository: Repository<User>;

  constructor() {
    this.usersRepository = getCustomRepository(UsersRepository);
  }
  async create(email: string) {
    const userExists = await this.usersRepository.findOne({ email });

    if (userExists) {
      return userExists;
    }
    const user = this.usersRepository.create({ email });

    try {
      await this.usersRepository.save(user);
      return user;
    } catch (error) {
      throw new Error("Erro no servidor, tente novamente mais tarde.");
    }
  }
  async findByEmail(email: string) {
    const userExists = await this.usersRepository.findOne({ email });

    if (userExists) {
      return userExists;
    }

    return false;
  }
}
export { UsersServices };
