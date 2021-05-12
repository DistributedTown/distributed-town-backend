var EC = require('elliptic').ec;
var keccak256 = require('keccak256');

// Create and initialize EC context
// (better do it once and reuse it)
var ec = new EC('secp256k1');


// // --------- Mobile App ---------

// // Generate keys
// var generated = ec.genKeyPair();

// const publicKey = generated.getPublic('hex');
// const privateKey = generated.getPrivate('hex');
// console.log('privateKey', privateKey);
// console.log('publicKey', publicKey);
// const hashedPubKey = keccak256(publicKey).toString('hex');
// console.log('hashedPubKey', hashedPubKey); // store this in the contract

// // -------- Mobile App --------

// // Sign QR code's nonce
// const privKey = ec.keyFromPrivate(privateKey);
// // Sign the message's hash (input must be an array, or a hex-string)
// var nonce = '123'
// const bufferNonce = Buffer.from(nonce);
// var signature = privKey.sign(bufferNonce);
// var derSign = signature.toDER();
// console.log(derSign);
// var sigAsString = Buffer.from(derSign).toString('hex');
// console.log('signature', sigAsString);

// // ---------- Chainlink External Adapter --------------
// // parameter sent - signature + nonce (fetched from the Backend) + hashedPubKey

// // Import public key
// var pubKey = ec.keyFromPublic(publicKey, 'hex');

// // Verify signature
// console.log(pubKey.verify(bufferNonce, sigAsString));


// // test with mobile app keys
// sigAsString = '3045022100dc42b3fc43b702a076b346174d4bb04f7b0446968470cd55925b9f4c78a9b1de02202b9be6525360e70d6f9e6c486b03901a483027463ec2c310d683f27b070b7af8'
// function hexToBytes(hex) {
//     for (var bytes = [], c = 0; c < hex.length; c += 2)
//     bytes.push(parseInt(hex.substr(c, 2), 16));
//     return bytes;
// }


// const bytes = hexToBytes(sigAsString);
// console.log('stringToHex', bytes);
// // var recid = ec.getKeyRecoveryParam(bufferNonce, signature, pubKey);
// // console.log(recid);
// const recoveredObj = ec.recoverPubKey(bufferNonce, bytes, 0);

// const recoveredKey = ec.keyFromPublic(recoveredObj, 'hex');
// const hexRecoveredKey = recoveredKey.getPublic('hex');
// console.log('hexRecoveredKey', hexRecoveredKey);
// const hashedRecoveredPubKey = keccak256(hexRecoveredKey).toString('hex');

// console.log(hashedRecoveredPubKey === hashedPubKey);



const private = ec.keyFromPrivate([36,34,1,232,50,83,234,53,194,123,116,188,73,82,115,51,144,221,11,74,195,169,108,138,243,167,19,72,70,225,211,22]);
const public = ec.keyFromPublic([4,46,212,96,56,102,226,2,224,49,199,52,183,56,42,176,175,83,164,97,221,74,96,242,8,99,158,137,82,85,216,34,31,4,191,150,103,101,75,29,218,173,58,104,72,51,235,13,202,209,115,129,47,249,226,31,98,63,129,34,20,88,214,40,237]);
// var pubHex = ec.keyFromPublic(public, 'hex');
const pubHex = public.getPublic('hex');

console.log('pubHex', pubHex);

var nonce = '123'
const bufferNonce = Buffer.from(nonce);
var signature = private.sign(bufferNonce);
var derSign = signature.toDER();
console.log(derSign);
var sigAsString = Buffer.from(derSign).toString('hex');
console.log('signature', sigAsString);

const isValid = public.verify(bufferNonce, signature);
console.log(isValid);


const publicHashed = 'd4b0f90611a2e81587bfd9c91a0bd242af2f6d32bf275d043fb0eabefc8d0b8e';
const hashedRecoveredPubKey = keccak256(pubHex).toString('hex');
console.log(hashedRecoveredPubKey);
