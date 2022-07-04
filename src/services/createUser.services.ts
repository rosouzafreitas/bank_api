import { UserRepository } from "../repositories/users.repository";

class UsersServices {
  checkUserExists = async (social_id: string) => {
    const repository = new UserRepository();
    if (await repository.checkUser(social_id)) {
      return true;
    } else return false;
  };

  createUser = async (
    name: string,
    birth_date: string,
    email: string,
    social_id: string,
    password: string
  ) => {
    const repository = new UserRepository();
    if (
      await repository.createUser(name, birth_date, email, social_id, password)
    ) {
      return true;
    } else return false;
  };
}

export { UsersServices };
