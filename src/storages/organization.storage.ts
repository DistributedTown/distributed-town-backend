import { UserSchema } from "../schemas";
import { LoggerService } from "../services";
import { Organization } from "../models";
import { injectable } from "inversify";
import { v4 as uuid } from "uuid";

@injectable()
export class OrganizationStorage {
  constructor(private logger: LoggerService) {
  }

  // use async await
  public async create(organization: Organization): Promise<Organization> {
    let result: Promise<Organization> = undefined;

    try {
      const newuser = new UserSchema(organization);
      newuser.id = uuid();
      const userSaved = newuser.save();
      result = userSaved;
    } catch (error) {
      result = Promise.reject(error);
    }

    return result;
  }

  public async getByID(id: string): Promise<Organization> {
    return this.getByFilter("id", id);
  }

  public async getByFilter(filterProperty: string, filterValue: string): Promise<Organization> {
    let result: Promise<Organization> = undefined;

    try {
      const filter: any = {};
      filter[filterProperty] = { $in: [filterValue] };
      result = UserSchema.findOne(filter).exec();
    } catch (error) {
      const errorMsg = `Cannot obtain organization ${filterValue}. Error: ${error}`;
      result = Promise.reject(new Error(errorMsg));
    }

    return result;
  }

  public async getAll(): Promise<Organization[]> {
    let result: Promise<Organization[]> = undefined;

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
