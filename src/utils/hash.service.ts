import SHA256 from 'crypto-js/sha256';

export function getHash(data: string): string {
    const hash = SHA256(data);
    return hash;
}

export function getGigStringForHashing(id: string, communityID: string, owner: string, credits: number): string {
    return `${id}-${communityID}-${owner}-${credits}`;
}