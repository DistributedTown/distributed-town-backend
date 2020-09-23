import { UserSchema } from "../schemas";
import { LoggerService } from "../services";
import { User } from "../models";
import { injectable } from "inversify";
import { v4 as uuid } from "uuid";

@injectable()
export class UserStorage {
  constructor(private logger: LoggerService) {
  }

  // use async await
  public async create(user: User): Promise<User> {
    let result: Promise<User> = undefined;

    try {
      const newuser = new UserSchema(user);
      newuser.id = uuid();
      const userSaved = newuser.save();
      result = userSaved;
    } catch (error) {
      result = Promise.reject(error);
    }

    return result;
  }

  public async getByID(id: string): Promise<User> {
    return this.getByFilter("id", id);
  }

  public async getByFilter(filterProperty: string, filterValue: string): Promise<User> {
    let result: Promise<User> = undefined;

    try {
      const filter: any = {};
      filter[filterProperty] = { $in: [filterValue] };
      result = UserSchema.findOne(filter).exec();
    } catch (error) {
      const errorMsg = `Cannot obtain user ${filterValue}. Error: ${error}`;
      result = Promise.reject(new Error(errorMsg));
    }

    return result;
  }

  public async getAll(): Promise<User[]> {
    let result: Promise<User[]> = undefined;

    try {
      const tmpres = await UserSchema.find({}).exec();
      result = Promise.resolve(tmpres);
    } catch (error) {
      const errorMsg = `Error: ${error}`;
      result = Promise.reject(new Error(errorMsg));
    }

    return result;
  }
}
