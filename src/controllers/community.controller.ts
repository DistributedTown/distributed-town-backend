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

  public get = async (req: any, res: Response) => {
    try {
      let template = req.query.template;
      const com = await services.getCommunities(template);
      res.status(200).send(com);
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }


  public getByAddress = async (req: any, res: Response) => {
    try {
      let address = req.params.address;
      console.log(address);
      if (address) {
        const com = await services.getCommunity(address);
        res.status(200).send(com);
      } else {
        res.status(400).send({ error: "Pass community address." })
      }
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

  public createProjectMilestone = async (req: any, res: Response) => {
    try {
      const milestoneId = await services.createMilestone(req.body.skillWalletId, req.params.projectId, req.body.url, req.body.ditoCredits);
      res.status(201).send({ milestoneId });
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }

  public getProjectMilestones = async (req: any, res: Response) => {
    try {
      const milestones = await services.getMilestones(req.params.projectId);
      res.status(201).send({ milestones });
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }

  public postPartnerAgreement = async  (req: any, res: Response) => {
    try {
      const key = await services.createPartnerAgreementKey(req.body.partnersAgreementAddress, req.body.communityAddress);
      res.status(201).send({ key });
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }

  public getCommunityByPartnerAgreementKey = async  (req: any, res: Response) => {
    try {
      const key = await services.getKey(req.params.key);
      if(key){
        const com = await services.getCommunity(key.communityAddress);
        com.partnersAgreementAddress = key.partnersAgreementAddress;
        res.status(200).send(com);
      } else 
        res.status(400).send({ error: 'Invalid key!'});
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


  public getGigs = async (req: any, res: Response) => {
    try {
      const gigs = await services.getGigs(req.params.communityAddress);
      res.status(201).send({ gigs });
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }

}

