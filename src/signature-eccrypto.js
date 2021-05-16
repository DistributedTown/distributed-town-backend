// var EC = require('elliptic').ec;
// var keccak256 = require('keccak256');
var eccryptoJS = require('eccrypto-js');

// const privKey = [36,34,1,232,50,83,234,53,194,123,116,188,73,82,115,51,144,221,11,74,195,169,108,138,243,167,19,72,70,225,211,22];
// const pubKey = [4,46,212,96,56,102,226,2,224,49,199,52,183,56,42,176,175,83,164,97,221,74,96,242,8,99,158,137,82,85,216,34,31,4,191,150,103,101,75,29,218,173,58,104,72,51,235,13,202,209,115,129,47,249,226,31,98,63,129,34,20,88,214,40,237];
// const key = eccryptoJS.generateKeyPair();
// const str = '123';
// const msg = eccryptoJS.utf8ToBuffer(str);
// // const hash = await eccryptoJS.sha256(str);

// const sig = eccryptoJS.sign(key.privateKey, msg);
// console.log('sig', sig);
// eccryptoJS.verify(key.publicKey, msg, sig);
const key = eccryptoJS.generateKeyPair();
// console.log(key);
// const hex = eccryptoJS.utf8ToHex(key.publicKey);
const hex = key.publicKey.toString('hex');
console.log("PUBLIC KEY HEX", hex);

const hashed = eccryptoJS.keccak256(Buffer.from(hex));
console.log("PUBLIC KEY HASHED", eccryptoJS.bufferToHex(hashed));

const str = 'test message to hash';
const msg = eccryptoJS.utf8ToBuffer(str);
const hash = eccryptoJS.sha256(msg);
const signed = eccryptoJS.sign(key.privateKey, hash);

// const signed = eccryptoJS.sign(key.privateKey, );
console.log(eccryptoJS.bufferToHex(signed), "SIGNED STRING");
