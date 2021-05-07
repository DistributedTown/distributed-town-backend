var EC = require('elliptic').ec;
var keccak256 = require('keccak256');

// Create and initialize EC context
// (better do it once and reuse it)
var ec = new EC('secp256k1');


// --------- Mobile App ---------

// Generate keys
var generated = ec.genKeyPair();

const publicKey = generated.getPublic('hex');
const privateKey = generated.getPrivate('hex');
console.log('privateKey', privateKey);
console.log('publicKey', publicKey);
const hashedPubKey = keccak256(publicKey).toString('hex');
console.log('hashedPubKey', hashedPubKey); // store this in the contract

// -------- Mobile App --------

// Sign QR code's nonce
const privKey = ec.keyFromPrivate(privateKey);
// Sign the message's hash (input must be an array, or a hex-string)
var nonce = '123123'
const bufferNonce = Buffer.from(nonce);
var signature = privKey.sign(bufferNonce);
var derSign = signature.toDER();
var sigAsString = Buffer.from(derSign).toString('hex');
console.log('signature', sigAsString);

// ---------- Chainlink External Adapter --------------
// parameter sent - signature + nonce (fetched from the Backend) + hashedPubKey


// Import public key
var pubKey = ec.keyFromPublic(publicKey, 'hex');

// Verify signature
console.log(pubKey.verify(bufferNonce, sigAsString));
var recid = ec.getKeyRecoveryParam(bufferNonce, signature, pubKey);
const recoveredObj = ec.recoverPubKey(bufferNonce, signature, recid, 'string');

const recoveredKey = ec.keyFromPublic(recoveredObj, 'hex');
const hexRecoveredKey = recoveredKey.getPublic('hex');
console.log('hexRecoveredKey', hexRecoveredKey);
const hashedRecoveredPubKey = keccak256(hexRecoveredKey).toString('hex');

console.log(hashedRecoveredPubKey === hashedPubKey);