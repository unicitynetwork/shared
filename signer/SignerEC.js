const CryptoJS = require('crypto-js');
const elliptic = require('elliptic');
const { hash } = require('../hasher/sha256hasher.js').SHA256Hasher;

const ec=new elliptic.ec('secp256k1');


class SignerEC {
    constructor(privateKeyHex) {
	this.privateKey = ec.keyFromPrivate(privateKeyHex, 'hex');
        this.publicKey = ec.keyFromPrivate(this.privateKey).getPublic('hex');
    }

    sign(messageHex) {
        const messageBuffer = Buffer.from(messageHex, 'hex');
        if (messageBuffer.length !== 32) {
            throw new Error('Message must be 32 bytes in length');
        }
	return this.privateKey.sign(messageBuffer).toDER('hex');
    }


    getPubKey(){
	return this.publicKey;
    }

    static getAlg() {
	return 'secp256k1';
    }
}

function getTxSigner(secret, nonce){
	if(nonce)return new SignerEC(hash(secret+nonce));
	    else
	return new SignerEC(hash(secret));
}

function generatePrivateKey() {
        let privateKey;
        do {
            privateKey = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
        } while (!secp256k1.privateKeyVerify(privateKey));
        return privateKey.toString('hex');
}

function verify(pubKeyHex, messageHex, signatureHex) {
        const pubKey = ec.keyFromPublic(pubKeyHex, 'hex') ;
        const messageBuffer = Buffer.from(messageHex, 'hex');
        const signature = Buffer.from(signatureHex, 'hex');
        
        if (messageBuffer.length !== 32) {
            throw new Error('Message must be 32 bytes in length');
        }

	return pubKey.verify(messageBuffer, signature);
}


module.exports = { SignerEC, getTxSigner, generatePrivateKey, verify }
