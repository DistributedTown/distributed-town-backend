import { LoggerService } from "../services";
import { Response } from "express";
import { injectable } from "inversify";
import { getCommunityByID, getCommunities } from "../services/community.service";
import threadDBClient from "../threaddb.config";

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
   * /community/:communityID:
   *  get:
   *      description: Gets community by id
   *      parameters:
   *          - in: path
   *            name: communityID
   *            type: string
   *            required: true
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
   *      parameters:
   *          - name: CreateCommunity
   *            type: CreateCommunity
   *            in: body
   *            schema:
   *               $ref: '#/definitions/CreateCommunity'
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

