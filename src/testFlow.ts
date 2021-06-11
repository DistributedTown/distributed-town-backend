import { Actions } from "./models";

require('dotenv').config()
const axios = require('axios').default;

const joinCommunity = async (): Promise<string> => {
    console.log('joining community');

    const getCommunities = await axios.get(`${process.env.DEV_API_URL}/community`);
    const communityAddress = getCommunities.data[0].address;
    const joinResp = await axios.post(`${process.env.DEV_API_URL}/community/join`,
        {
            "communityAddress": communityAddress,
            "userAddress": "0x3BCA13D24FFB8286d48ac0847D89b9DC638e3dEa",
            "url": "https://hub.textile.io/ipfs/bafkreicucfykyhkhkp2p64fesnjnjbdguzh5q5t6n3r6bfa5g5gbvzysvq",
            "skills": {
                "skills": [
                    {
                        "name": "Smart Contracts",
                        "value": 10
                    },
                    {
                        "name": "Backend",
                        "value": 8
                    },
                    {
                        "name": "Frontend",
                        "value": 10
                    }
                ]
            }
        },
        {
            headers: {
                'Content-Type': 'application/json',
            }
        });
    console.log(joinResp.data);
    const tokenId = joinResp.data.tokenId;
    console.log(tokenId);
    return tokenId;
}

const generateNonce = async (action: number, tokenId: string) => {
    const nonce = await axios.post(`${process.env.DEV_API_URL}/skillWallet/${tokenId}/nonces?action=${action}`);
    console.log('nonce', nonce);
    return nonce.data;
}

const activateSW = async (tokenId: string) => {
    console.log('activate skill wallet');
    const pubKey = '7e61b836b79ed463994e6a9c6e9a92bdc4418ddfde88c9ec8adca3ea8d23ec4a';
    const activateRes = await axios.post(`${process.env.DEV_API_URL}/skillWallet/${tokenId}/activate`,
        {
            pubKey
        },
        {
            headers: {
                'Content-Type': 'application/json',
            }
        });
    console.log('res', activateRes.data);
}

const isActive = async (tokenId: string) => {
    console.log('activate skill wallet');
    const isActive = await axios.get(`${process.env.DEV_API_URL}/skillWallet/${tokenId}/isActive`);
    console.log('res', isActive);
}

const login = async (tokenId: string) => {
    const action = Actions.LOGIN;
    const signature = '9266a4aa1fe3bae8eaec10aab954ba560efdd976ca850b01e956b586121dbfbf275f2bde2071071fa08ed4d7b10626510300f1dc752c4924e85743a463b900761b';
    const nonce = await generateNonce(action, tokenId);
    console.log(nonce);
    await axios.post(`${process.env.DEV_API_URL}/skillWallet/${tokenId}/validate`,
        {
            signature,
            action
        },
        {
            headers: {
                'Content-Type': 'application/json',
            }
        });

    while(true) {
        const logins = await axios.get(`${process.env.DEV_API_URL}/skillWallet/logins`);
        if(logins.tokenId !== '-1'){
            console.log('validation passed');
            console.log(logins.tokenId);
            break;
        }
    }

    const sw = await axios.get(`${process.env.DEV_API_URL}/skillWallet/${tokenId}`);
    console.log(sw.data);
}

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

const test = async () => {
    console.log('join started');
    const tokenId = await joinCommunity();
    // const tokenId = '3';
    console.log('join ended');
    // const tokenId = '4';

    console.log('activate started');
    await activateSW(tokenId);
    console.log('activate ended');
    await isActive(tokenId);

    console.log('login started');
    await login(tokenId);
    console.log('login ended');
};

test();