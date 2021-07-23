// var EC = require('elliptic').ec;
// var keccak256 = require('keccak256');
var eccryptoJS = require('eccrypto-js');

const key = eccryptoJS.generateKeyPair();
const hex = key.publicKey.toString('hex');
console.log("PUBLIC KEY HEX", hex);

const hashed = eccryptoJS.keccak256(Buffer.from(hex));
console.log("PUBLIC KEY HASHED", eccryptoJS.bufferToHex(hashed));

const str = 'test message to hash';
const msg = eccryptoJS.utf8ToBuffer(str);
 eccryptoJS.sha256(msg).then(hash => {
    const signed = eccryptoJS.sign(key.privateKey, hash);
    console.log("SIGNED STRING", eccryptoJS.bufferToHex(signed));
});