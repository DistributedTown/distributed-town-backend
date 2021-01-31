import { LoggerService } from "../services";
import { Response } from "express";
import { injectable } from "inversify";
import { getCommunityByID, getCommunities, createCommunity } from "../services/community.service";


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
      let category = req.query.category;
      if (!blockchain) {
        blockchain = 'ETH';
      }
      const com = await getCommunities(blockchain, category);
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
      if (req.get('skillWalletID')) {
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
      req.body.scarcityScore = 0;
      const response = await createCommunity(req.get('skillWalletID'), req.body);
      res.status(200).send(response);
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }
}

