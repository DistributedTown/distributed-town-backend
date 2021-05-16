import { LoggerService } from "../services";
import { Response } from "express";
import { injectable } from "inversify";
import { SkillWalletContracts } from "../contracts/skillWallet.contracts";
import * as skillWalletService from '../services/skillWallet.service';
import * as eccryptoJS from 'eccrypto-js';

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
      console.log(req.query.tokenId);
      const skillWallet = await skillWalletService.getSkillWallet(req.query.tokenId);
      console.log(skillWallet);
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
      const skillWallet = await skillWalletService.getCommunityDetails(req.query.address);
      return res.status(200).send(skillWallet);
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }

  public hasPendingAuthentication = async (req: any, res: Response) => {
    try {
      const pendingAuth = await skillWalletService.hasPendingActivation(req.query.address);
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

      const isActive = await SkillWalletContracts.isActive(req.params.skillWalletId);
      if (isActive) {
        console.log('skill wallet active');
        return res.status(400).send({ message: "Skill Wallet already activated" });
      } else {
        console.log('activating SW');
        await SkillWalletContracts.activate(req.params.skillWalletId, req.body.pubKey);
        return res.status(200).send({ message: "Skill Wallet activated successfully." });
      }
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }

  public getMessages = async (req: any, res: Response) => {
    try {
      const messages = await skillWalletService.getMessagesBySkillWalletID(req.params.skillWalletId);
      return res.status(200).send({ messages });
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }

  public generateNonce = async (req: any, res: Response) => {
    try {
      const nonce = await skillWalletService.getNonceForQR(req.query.action, req.params.tokenId);
      res.status(200).send(nonce);
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }

  public login = async (req: any, res: Response) => {
    try {
      const success = await skillWalletService.loginValidation(req.body.nonce, req.body.tokenId);
      if (success)
        res.status(200).send({ message: "Successful login." });
      else
        res.status(400).send({ message: "Invalid login." });

    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }

  public getLogins = async (req: any, res: Response) => {
    try {
      const tokenId = await skillWalletService.getTokenIDAfterLogin(req.query.nonce);
      if (tokenId === "-1")
        return res.status(200).send({ message: "The QR code is not yet scanned." });
      else
        return res.status(200).send({ tokenId });
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }

  public getNonceForValidation = async (req: any, res: Response) => {
    try {
      const nonces = await skillWalletService.findNonce(req.query.action, req.params.skillWalletId);
      return res.status(200).send({ nonces });
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }

  public deleteNonce = async (req: any, res: Response) => {
    try {
      const nonces = await skillWalletService.invalidateNonce(req.query.nonce, req.params.skillWalletId, req.query.action);
      return res.status(200).send();
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }

  public validateSW = async (req: any, res: Response) => {
    try {
      await SkillWalletContracts.validate(req.body.signature, req.body.tokenId, req.body.action);
      return res.status(200).send();
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }

  public getKeys = async (req: any, res: Response) => {
    // mobile App
    const key = eccryptoJS.generateKeyPair();
    const hex = key.publicKey.toString('hex');
    console.log("PUBLIC KEY HEX", hex);

    const hashed = eccryptoJS.keccak256(Buffer.from(hex));
    console.log("PUBLIC KEY HASHED", eccryptoJS.bufferToHex(hashed));

    const str = '123';
    const msg = eccryptoJS.utf8ToBuffer(str);
    const hash = await eccryptoJS.sha256(msg);
    const signed = eccryptoJS.sign(key.privateKey, hash, true);

    const signedStr = eccryptoJS.bufferToHex(signed);
    console.log(signedStr, "SIGNED STRING");

    // Adapter


    function hexToBytes(hex) {
      for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
      return bytes;
    }

    const sigBytes = hexToBytes(signedStr);
    const buf = Buffer.from(sigBytes);

    const pub = eccryptoJS.recover(hash, buf);
    const recoveredHexPub = pub.toString('hex');
    console.log("RECOVEDER PUBLIC KEY HEX", recoveredHexPub);

    const hashedRecoveredPub = eccryptoJS.keccak256(Buffer.from(recoveredHexPub));
    console.log("RECOVEDER PUBLIC KEY HASHED", eccryptoJS.bufferToHex(hashedRecoveredPub));
    res.status(200).send({ isValid: eccryptoJS.bufferToHex(hashed) === eccryptoJS.bufferToHex(hashedRecoveredPub) });
  }
}
