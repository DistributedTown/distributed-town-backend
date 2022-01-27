import * as services from "../services";
import { Response } from "express";
import { injectable } from "inversify";
import { skillNames } from "../models";

@injectable()
export class SkillsController {

  constructor(
    private loggerService: services.LoggerService,
  ) {
  }

  public get = async (req: any, res: Response) => {
    try {
      const skillName = req.query.skill;
      const category = req.query.category;
      let skills = undefined;
      if (skillName) {
        skills = await services.findMainCat(skillName);
      } else if (category) {
        skills = await services.getByCategory(category);
      }
      else {
        skills = await services.getAllSkills();
      }
      res.status(200).send(skills);
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }



  public getNames = async (req: any, res: Response) => {
    try {
      res.status(200).send(skillNames);
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }
}

