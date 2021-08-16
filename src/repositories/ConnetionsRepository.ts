import { EntityRepository, Repository } from "typeorm";
import { Connection } from "../entities/Connection";

@EntityRepository(Connection)
class ConnetionsRepository extends Repository<Connection> {}

export { ConnetionsRepository };
