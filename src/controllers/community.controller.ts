import { LoggerService } from "../services";
import { Response } from "express";
import { injectable } from "inversify";
import { getCommunityByID, getCommunities } from "../services/community.service";
import threadDBClient from "../threaddb.config";
import { CommunitiesCollection } from "../constants/constants";

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
      let blockchain = req.query.blockchain; 
      if(!blockchain) {
        blockchain = 'ETH';
      }
      const com = await getCommunities(blockchain);
      res.status(200).send(com);
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
      if (req.isAuthenticated()) {
        const communityID = req.params.communityID;
        var response = await getCommunityByID(communityID);
        res.status(200).send(response);
      } else {
        res.status(401).send({ error: 'User not logged in.' });
      }
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }


  
  /**
   * @swagger
   * /community:
   *  post:
   *      description: Creates a new community 
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
  public post = async (req: any, res: Response) => {
    try {
      if (req.isAuthenticated()) {
        req.body.scarcityScore = 0;
        const response = await threadDBClient.createCommunity(req.body);
        res.status(200).send(response);
      } else {
        res.status(401).send({ error: 'User not logged in.' });
      }
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }
}

