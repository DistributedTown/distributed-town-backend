export * from "./community"
export * from "./skillCategory";
export * from "./validationResponseModel";
export * from "./project";
export * from './skillWallet';
export * from './qrCodeAuth';
export * from './messages';
export * from './milestone';
export * from './key';
export * from './gig';

export const skillNames = [
    //Local
    'Fun & Entertainment', 'Administration & Management', 'Community Life', 'Leadership & Public Speaking',
    'Legal', 'Accounting', 'Art, Music & Creativity', 'Teaching',
    'Company', 'Householding', 'Gardening', 'Cooking',
    
    //Art
    'Performance & Theather', 'Project Management', 'Production', 'Gaming',
    'Music', 'Painting', 'Photography', 'Video-making',
    'Training & Sport', 'Hiking', 'Biking', 'Writing',

    // Tech
    'Network Design', 'Tokenomics', 'Game Theory', 'Governance & Consensus',
    'Backend', 'Frontend', 'Web Dev', 'Mobile Dev',
    'DeFi', 'Blockchain infrastructure', 'Architecture', 'Smart Contracts'
]

export const templateCategories = {
    local: {
        start: 0,
        end: 11
    },
    art: {
        start: 12,
        end: 23
    },
    tech: {
        start: 24,
        end: 35
    }
}