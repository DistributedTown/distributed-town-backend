import { LoggerService } from "../services";
import { Request, Response } from "express";
import { injectable } from "inversify";
import threadDBClient from "../threaddb.config";

@injectable()
export class SkillsController {

  constructor(
    private loggerService: LoggerService,
  ) {
  }

  /**
   * @swagger
   * /skill:
   *  get:
   *      description: Gets all predefined skills from the database
   *      tags:
   *          - Skills
   *      produces:
   *          - application/json
   *      responses:
   *          200:
   *              description: OK
   *          500:
   *              description: Server error
   */
  public get = async (_req: Request, res: Response) => {
    try {
      const skills = await threadDBClient.getAll('Skills');
      res.status(200).send(skills);
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }
}

