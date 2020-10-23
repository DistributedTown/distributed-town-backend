import { findMainCat, getAllSkills, LoggerService } from "../services";
import { Request, Response } from "express";
import { injectable } from "inversify";
import threadDBClient from "../threaddb.config";
import { GeneralSkillsCollection, MessagesCollection } from "../constants/constants";

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
      const skillName = req.query.skill;
      let skills = undefined;
      if (skillName) {
        skills = await findMainCat(skillName);
      } else {
        skills = await getAllSkills();
      }
      res.status(200).send(skills);
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }
}

