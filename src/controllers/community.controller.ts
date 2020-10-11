import { LoggerService } from "../services";
import { Response } from "express";
import { injectable } from "inversify";
import { getCommunitiesBySkill, getCommunityByID } from "../services/community.service";

@injectable()
export class CommunityController {
  constructor(
    private loggerService: LoggerService,
  ) { }

  /**
   * @swagger
   * /community:
   *  get:
   *      description: Gets all communities from the database
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
      // if (req.isAuthenticated()) {
        const skillName = req.query.skill;
        var response = await getCommunitiesBySkill(skillName);
        res.status(200).send(response);
      // } else {
      //   res.status(401).send( { error: 'User not logged in.'} );
      // }
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }

  
  /**
   * @swagger
   * /community:
   *  get/:communityID:
   *      description: Gets community by id
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
  public getByID = async (req: any, res: Response) => {
    try {
      // if (req.isAuthenticated()) {
        const communityID = req.params.communityID;
        var response = await getCommunityByID(communityID);
        res.status(200).send(response);
      // } else {
      //   res.status(401).send( { error: 'User not logged in.'} );
      // }
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }
}

