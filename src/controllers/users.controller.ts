import { LoggerService } from "../services";
import { Response } from "express";
import { injectable } from "inversify";
import {
  getMessages,
  updateCommunityID,
  validateUser
} from "../services/user.service";
import { getSkillWalletByID, SkillWallet, storeSkillWallet } from "../skillWallet/skillWallet.client";


@injectable()
export class UsersController {
  constructor(
    private loggerService: LoggerService,
  ) { }

  /**
   * @swagger
   * /user:
   *  get:
   *      description: Gets all users from the database
   *      tags:
   *          - Users
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
      if (req.get('skillWalletID')) {

        const user = await getSkillWalletByID(req.get('skillWalletID'))
        return res.status(200).send(user);
      }
      else
        return res.status(401).send({ message: `User is not logged in.` });
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }

  /**
   * @swagger
   * /user:
   *  post:
   *      description: Creates a new user
   *      parameters:
   *          - name: User
   *            type: User
   *            in: body
   *            schema:
   *               $ref: '#/definitions/CreateUser'
   *      tags:
   *          - Users
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
      const validationResult = await validateUser(req.body);
      if (validationResult.isValid) {
        const skillWallet: SkillWallet = {
          _id: undefined,
          username: req.body.username,
          communityID: req.body.communityID,
          skillWallet: req.body.skillWallet
        }
        const skillWalletID = await storeSkillWallet(skillWallet);
        res.status(201).send({ skillWalletID });
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
   * /user:
   *  put:
   *      description: Changes community ID
   *      parameters:
   *          - name: ChangeCommunity
   *            type: ChangeCommunity
   *            in: body
   *            schema:
   *               $ref: '#/definitions/ChangeCommunity'
   *      tags:
   *          - Users
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
  public put = async (req: any, res: Response) => {
    try {
      if (req.get('skillWalletID')) {
        await updateCommunityID(req.get('skillWalletID'), req.body.communityID);
        res.status(200).send();
      } else {
        return res.status(401).end({ message: 'Could not log user in.' });
      }
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }



  /**
   * @swagger
   * /user/messages:
   *  get:
   *      description: Gets user messages
   *      tags:
   *          - Users
   *      produces:
   *          - application/json
   *      responses:
   *          200:
   *              description: Messages returned
   *          400:
   *              description: Bad Request
   *          500:
   *              description: Server error
   */
  public getMessages = async (req: any, res: Response) => {
    try {
      if (req.get('skillWalletID')) {
        const response = await getMessages(req.get('skillWalletID'));
        res.status(200).send(response);
      } else {
        return res.status(401).end({ message: 'Could not log user in.' });
      }
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }


  /**
     * @swagger
     * /user/invite:
     *  get:
     *      description: Get link for inviting new members to the user's commynity
     *      tags:
     *          - Users
     *      produces:
     *          - application/json
     *      responses:
     *          200:
     *              description: Created
     *          401:
     *              description: Unauthorized
     *          500:
     *              description: Server error
     */
  public invite = async (req: any, res: Response) => {
    try {
      if (req.get('skillWalletID')) {
        //TODO : invitation links
        // const linkUrl = await getInvitationLink(req.get('skillWalletID'));
        const linkUrl = 'a'
        if (linkUrl) {
          res.status(200).send({ linkUrl: linkUrl });
        } else {
          res.status(400).send({ message: 'User not associated with a community.' });
        }
      } else {
        return res.status(401).end({ message: 'Could not log user in.' });
      }
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }



}