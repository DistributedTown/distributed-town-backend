import { LoggerService } from "../services";
import { Response } from "express";
import { injectable } from "inversify";
import { getCommunities } from "../services/community.service";


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
}

