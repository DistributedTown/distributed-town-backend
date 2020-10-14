import { LoggerService } from "../services";
import {  Response } from "express";
import { injectable } from "inversify";
import { acceptGig, createGig, getGigs, validateAcceptingGig, validateGig } from "../services/gig.service";

const { Magic } = require("@magic-sdk/admin");
const magic = new Magic('sk_live_B4234DDF6AE0251D');

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
  public get = async (req: any, res: Response) => {
    try {
      if (req.isAuthenticated()) {
        const isOpen: boolean = req.query.isOpen === 'true';
        const userMetadata = await magic.users.getMetadataByIssuer(req.user.issuer);
        const gigs = await getGigs(userMetadata.email, isOpen);
        res.status(200).send(gigs);
      } else {
        return res.status(401).end({ message: `User is not logged in.` });
      }
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
  public post = async (req: any, res: Response) => {
    try {
      if (req.isAuthenticated()) {
        req.body.isOpen = true;
        const validationResult = await validateGig(req.body);
        if (validationResult.isValid) {
          const userMetadata = await magic.users.getMetadataByIssuer(req.user.issuer);
          const gigID = await createGig(userMetadata.email, req.body);
          res.status(201).send({ gigID: gigID });
        } else {
          res.status(400).send({ message: validationResult.message });
        }
      } else {
        return res.status(401).end({ message: `User is not logged in.` });
      }

    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }


  /**
   * @swagger
   * /gig/:gigID/accept:
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
  public accept = async (req: any, res: Response) => {
    try {
      if (req.isAuthenticated()) {
        const validationResult = await validateAcceptingGig(req.params.gigID);
        if (validationResult.isValid) {
          await acceptGig(req.params.gigID, req.body.userID);
          res.status(200).send();
        } else {
          res.status(400).send({ message: validationResult.message });
        }
      } else {
        return res.status(401).end({ message: `User is not logged in.` });
      }
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }
}
