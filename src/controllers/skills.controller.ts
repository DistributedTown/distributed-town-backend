import { LoggerService } from "../services";
import { Request, Response } from "express";
import { injectable } from "inversify";
import threadDBClient from "../threaddb.config";
import { SkillsCollection } from "../constants/constants";

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
  public get = async (req: any, res: Response) => {
    try {
      // if (req.isAuthenticated()) {
        const skills = await threadDBClient.getAll(SkillsCollection);
        res.status(200).send(skills);
      // } else {
      //   res.status(401).send({ error: 'User not logged in.' });
      // }
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }
}

