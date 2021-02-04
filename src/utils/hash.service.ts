var crypto = require('crypto');

export function getHash(data: string): string {
    var hash = crypto.createHash('sha256').update(data).digest('hex');
    return `0x${hash}`;
}

export function getGigStringForHashing(id: string, communityID: string, owner: string, credits: number): string {
    return `${id}-${communityID}-${owner}-${credits}`;
}