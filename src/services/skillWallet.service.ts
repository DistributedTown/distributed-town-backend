
import { skillNames, SkillWallet } from '../models';
import { SkillWalletContracts } from '../contracts/skillWallet.contracts';
import { CommunityContracts } from '../contracts/community.contracts';
const fs = require('fs');

export const getSkillWallet = async (tokenId: number): Promise<SkillWallet> => {

    const skillWallet: SkillWallet = {
        nickname: "jabyl",
        imageUrl: '',
        diToCredits: 2740,
        currentCommunity: {
            name: 'DiTo #24',
            address: '0x2CEF62C91Dd92FC35f008D1d6Ed08EADF64306bc'
        },
        pastCommunities: [
            {
                name: 'DiTo #24',
                address: '0x2CEF62C91Dd92FC35f008D1d6Ed08EADF64306bc'
            }
        ],
        skills: [
            {
                name: 'Tokenomics',
                value: 6
            },
            {
                name: 'Network Design',
                value: 6
            },
            {
                name: 'Game Theory',
                value: 6
            }
        ]

    }
    return Promise.resolve(skillWallet);

    // const skillWallet: SkillWallet = undefined;
    // const isActive = await SkillWalletContracts.isSkillWalletRegistered(tokenId);
    // if (isActive) {
    //     const jsonUri = await SkillWalletContracts.getTokenURI(tokenId);

    //     let rawdata = fs.readFileSync(jsonUri);
    //     let jsonMetadata = JSON.parse(rawdata);
    //     skillWallet.imageUrl = jsonMetadata.image;
    //     skillWallet.nickname = jsonMetadata.nickname;

    //     const oldCommunityAddresses: string[] = await SkillWalletContracts.getCommunityHistory(tokenId);

    //     oldCommunityAddresses.forEach(async address => {
    //         const name = await CommunityContracts.getName(address);
    //         skillWallet.pastCommunities.push({
    //             name,
    //             address
    //         })
    //     });

    //     const currentCommunity = await SkillWalletContracts.getCurrentCommunity(tokenId);

    //     skillWallet.currentCommunity.address = currentCommunity;
    //     skillWallet.currentCommunity.name = await CommunityContracts.getName(currentCommunity);

    //     const skills = await SkillWalletContracts.getSkills(tokenId);
    //     skillWallet.skills.push({
    //         name: skillNames[skills.skill1.displayStringId],
    //         value: skills.skill1.level
    //     });
    //     if (skills.skill2)
    //         skillWallet.skills.push({
    //             name: skillNames[skills.skill2.displayStringId],
    //             value: skills.skill2.level
    //         });
    //     if (skills.skill3)
    //         skillWallet.skills.push({
    //             name: skillNames[skills.skill3.displayStringId],
    //             value: skills.skill3.level
    //         });
    // } else {
    //     return undefined;
    // }
}