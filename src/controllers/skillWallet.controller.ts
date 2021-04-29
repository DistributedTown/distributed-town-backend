import { LoggerService } from "../services";
import { Response } from "express";
import { injectable } from "inversify";
import { SkillWalletContracts } from "../contracts/skillWallet.contracts";
import { getCommunityDetails, getMessagesBySkillWalletID, getSkillWallet, getTokenIDAfterLogin, getUniqueStringForLogin, hasPendingAuth, verifyUniqueString } from '../services/skillWallet.service';

@injectable()
export class SkillWalletController {
  constructor(
    private loggerService: LoggerService,
  ) { }

  /**
   * @swagger
   * /skillWallet:
   *  get:
   *      description: Returns skill wallet data
   *      tags:
   *          - SkillWallet
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
      const skillWallet = await getSkillWallet(req.query.address);
      if (skillWallet)
        return res.status(200).send(skillWallet);
      else
        return res.status(400).send({ message: 'Skill Wallet does not exist or it is not activated yet' });
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }


  /**
   * @swagger
   * /skillWallet:
   *  get:
   *      description: Returns skill wallet data
   *      tags:
   *          - SkillWallet
   *      produces:
   *          - application/json
   *      responses:
   *          200:
   *              description: OK
   *          500:
   *              description: Server error
   */
  public getCommunity = async (req: any, res: Response) => {
    try {
      const skillWallet = await getCommunityDetails(req.query.address);
      return res.status(200).send(skillWallet);
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }

  public hasPendingAuthentication = async (req: any, res: Response) => {
    try {
      const pendingAuth = await hasPendingAuth(req.query.address);
      return res.status(200).send({ hasPendingAuth: pendingAuth });
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }


  /**
   * @swagger
   * /skillWallet/register:
   *  post:
   *      description: Validates the skill wallet by scanning the QR code 
   *      tags:
   *          - SkillWallet
   *      produces:
   *          - application/json
   *      responses:
   *          200:
   *              description: OK
   *          500:
   *              description: Server error
   */
  public activateSkillWallet = async (req: any, res: Response) => {
    try {
      // const isRegistered = SkillWalletContracts.isActive(req.body.tokenId);
      // if (isRegistered) {
      //   return res.status(400).send({ message: "Skill Wallet already activated" });
      // } else {
      await SkillWalletContracts.activate(req.body.tokenId, req.body.hash);
      // if (success)
      return res.status(200).send({ message: "Skill Wallet activated successfully." });
      // else
      //   return res.status(500).send({ message: "Something went wrong!" });
      // }
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }

  public getMessages = async (req: any, res: Response) => {
    try {
      const messages = await getMessagesBySkillWalletID(req.params.skillWalletId);
      return res.status(200).send({ messages });
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }


  public getUniqueStringForLogin = async (req: any, res: Response) => {
    try {
      const str = await getUniqueStringForLogin();
      return res.status(200).send({ uniqueString: str });
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }

  public login = async (req: any, res: Response) => {
    try {
      const str = await verifyUniqueString(req.body.tokenId, req.body.uniqueString);
      return res.status(200).send({ uniqueString: str });
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }

  public getLogins = async (req: any, res: Response) => {
    try {
      const tokenId = await getTokenIDAfterLogin(req.body.uniqueString);
      if (tokenId === -1)
        return res.status(200).send({ message: "The QR code is not yet scanned." });
      else
        return res.status(200).send({ tokenId });
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }
}