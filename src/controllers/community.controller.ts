import * as services from "../services";
import { Response } from "express";
import { injectable } from "inversify";
import { Skill, skillNames } from "../models";
import { ProjectsContracts } from "../contracts/projects.contract";


@injectable()
export class CommunityController {
  constructor(
    private loggerService: services.LoggerService,
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
      const com = await services.getCommunities(template);
      res.status(200).send(com);
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }

  public getProjects = async (req: any, res: Response) => {
    try {
      const projects = await services.getProjectsPerCommunity(req.params.communityAddress);
      res.status(200).send(projects);
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }

  public createProject = async (req: any, res: Response) => {
    try {
      const projectId = await ProjectsContracts.createProject(req.body.url, req.body.communityAddress, req.body.creator);
      res.status(201).send({ projectId });
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }

  public createProjectMilestone =  async (req: any, res: Response) => {
    try {
      const milestoneId = await services.createMilestone(req.body.skillWalletId, req.params.projectId, req.body.url, req.body.ditoCredits);
      res.status(201).send({ milestoneId });
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }

  public getProjectMilestones =  async (req: any, res: Response) => {
    try {
      const milestones = await services.getMilestones(req.params.projectId);
      res.status(201).send({ milestones });
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }
  public calculateCredits = async (req: any, res: any) => {
    try {
      console.log(req.query.skill1ID);
      console.log(skillNames[req.query.skill1ID]);
      const skillModel: Skill[] = [
        {
          name: skillNames[req.query.skill1ID],
          value: req.query.lvl1
        },
        {
          name: skillNames[req.query.skill2ID],
          value: req.query.lvl2

        },
        {
          name: skillNames[req.query.skill3ID],
          value: req.query.lvl3

        },
      ]
      const credits = await services.calculateInitialCreditsAmount(skillModel);
      res.status(200).send({ credits });
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }
}

