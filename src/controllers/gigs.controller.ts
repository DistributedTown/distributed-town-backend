import { LoggerService } from "../services";
import { Request, Response } from "express";
import { injectable } from "inversify";
import threadDBClient from "../threaddb.config";
import { acceptGig, validateAcceptingGig, validateGig } from "../services/gig.service";
import { GigsCollection } from "../constants/constants";
import { Where } from "@textile/hub";

@injectable()
export class GigsController {
  constructor(
    private loggerService: LoggerService,
  ) { }

  /**
   * @swagger
   * /gig:
   *  get:
   *      description: Gets all open gigs from the database
   *      tags:
   *          - Gigs
   *      produces:
   *          - application/json
   *      responses:
   *          200:
   *              description: OK
   *          500:
   *              description: Server error
   */
  public get = async (req: Request, res: Response) => {
    try {
      const query = new Where('isOpen').eq(true);
      const gigs = await threadDBClient.filter(GigsCollection, query);
      res.status(200).send(gigs);
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }

  /**
   * @swagger
   * /gig:
   *  post:
   *      description: Opens a gig
   *      parameters:
   *          - name: Gig
   *            type: Gig
   *            in: body
   *            schema:
   *               $ref: '#/definitions/CreateGig'
   *      tags:
   *          - Gigs
   *      produces:
   *          - application/json
   *      responses:
   *          201:
   *              description: Created
   *          400:
   *              description: Bad Request
   *          500:
   *              description: Server error
   */
  public post = async (req: Request, res: Response) => {
    try {
      req.body.isOpen = true;
      const validationResult = await validateGig(req.body);
      if (validationResult.isValid) {
        const inserted = await threadDBClient.insert(GigsCollection, req.body);
        res.status(201).send({ gigID: inserted[0] });
      } else {
        res.status(400).send({ message: validationResult.message });
      }
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }


  /**
   * @swagger
   * /gig/:gigId/accept:
   *  post:
   *      description: Complete a gig
   *      parameters:
   *          - name: Gig
   *            type: Gig
   *            in: body
   *            schema:
   *               $ref: '#/definitions/CompleteGig'
   *      tags:
   *          - Gigs
   *      produces:
   *          - application/json
   *      responses:
   *          200:
   *              description: Completed
   *          400:
   *              description: Bad Request
   *          500:
   *              description: Server error
   */
  public accept = async (req: Request, res: Response) => {
    try {
      const validationResult = await validateAcceptingGig(req.params.gigID);
      if (validationResult.isValid) {
        await acceptGig(req.params.gigID, req.body.userID);
        res.status(200).send();
      } else {
        res.status(400).send({ message: validationResult.message });
      }
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }
}
