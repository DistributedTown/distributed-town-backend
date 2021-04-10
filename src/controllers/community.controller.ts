import { calculateInitialCreditsAmount, LoggerService } from "../services";
import { Response } from "express";
import { injectable } from "inversify";
import { getCommunities, join } from "../services/community.service";
import { Skill, skillNames } from "../models";


@injectable()
export class CommunityController {
  constructor(
    private loggerService: LoggerService,
  ) { }

  /**
   * @swagger
   * /community:
   *  get:
   *      description: Gets all communities from the database with blockchain addresses. Blockchain value defaults to ETH. Possible values ETH/RSK
   *      parameters:
   *          - in: query
   *            name: blockchain
   *            type: string
   *            required: false
   *          - in: query
   *            name: category
   *            type: string
   *            required: false
   *      tags:
   *          - Community
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
      let blockchain = req.query.blockchain;
      let template = req.query.template;
      if (!blockchain) {
        blockchain = 'MATIC';
      }
      const com = await getCommunities(template);
      res.status(200).send(com);
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }

  public joinNewUser = async (req: any, res: any) => {
    try {
      console.log(req.body);
      const credits = await join(req.body.communityAddress, req.body.userAddress, req.body.skills, req.body.url);
      res.status(200).send({ credits });
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }


  public calculateCredits = async (req: any, res: any) => {
    try {
      console.log(req.query.skill1ID);
      console.log(skillNames[req.query.skill1ID]);
      const skillModel: Skill[] = [
        {
          name: skillNames[req.query.skill1ID],
          value: req.query.lvl1
        },
        {
          name: skillNames[req.query.skill2ID],
          value: req.query.lvl2

        },
        {
          name: skillNames[req.query.skill3ID],
          value: req.query.lvl3

        },
      ]
      const credits = await calculateInitialCreditsAmount(skillModel);
      res.status(200).send({ credits });
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }
}

