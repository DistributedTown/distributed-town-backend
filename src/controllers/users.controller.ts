import { LoggerService } from "../services";
import { Request, Response } from "express";
import { injectable } from "inversify";
import { User } from "../models";

@injectable()
export class UsersController {
  constructor(
    private loggerService: LoggerService,
  ) { }

  /**
   * @swagger
   * /:
   *  get:
   *      description: Gets all users from the database
   *      tags:
   *          - Users
   *      produces:
   *          - application/json
   *      responses:
   *          200:
   *              description: OK
   *          500:
   *              description: Server error
   */
  public get = async (req: Request, res: Response) => {
    try {
      const response: User = {
        id: "ba60a22e-2178-4d58-bf47-c9d337c093ba", 
        name: "Milena",
        organization: "8319543e-f6e3-4af1-9595-4b91d87b0bae"
      }
      res.status(200).send(response);
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }
}

