const {createHash} = require('crypto')
const {CryptoFactory, createContext } = require('sawtooth-sdk/signing')
const protobuf = require('sawtooth-sdk/protobuf')
const fs = require('fs')
const http = require('http');
const fetch = require('node-fetch');
const {Secp256k1PrivateKey} = require('sawtooth-sdk/signing/secp256k1')	
const {TextEncoder, TextDecoder} = require('text-encoding/lib/encoding')


FAMILY_NAME='HelloWorld'

privateKeyHex = "66ad89d0ff29b0267fba72ea8d40ef7975e10f8acde8d50d20cdf56ba9599c5e";

function hash(v) {
  return createHash('sha512').update(v).digest('hex');
}

class UserClient{
  constructor(){
    const context = createContext('secp256k1');
    const secp256k1pk = Secp256k1PrivateKey.fromHex(privateKeyHex.trim());
    this.signer = new CryptoFactory(context).newSigner(secp256k1pk);
    this.publicKey = this.signer.getPublicKey().asHex();
    this.address = hash("HelloWorld").substr(0, 6) + hash(this.publicKey).substr(0, 64);
    console.log("Storing at: " + this.address);
    
  }



send_data(values){
  
  var payload = ''
  const address = this.address;
  var inputAddressList = [address];
  var outputAddressList = [address];
  payload = values;
  var encode =new TextEncoder('utf8');
  const payloadBytes = encode.encode(payload)
  const transactionHeaderBytes = protobuf.TransactionHeader.encode({
    familyName: 'HelloWorld',
    familyVersion: '1.0',
    inputs: inputAddressList,
    outputs: outputAddressList,
    signerPublicKey: this.signer.getPublicKey().asHex(),
    nonce: "" + Math.random(),
    batcherPublicKey: this.signer.getPublicKey().asHex(),
    dependencies: [],
    payloadSha512: hash(payloadBytes),
  }).finish();

  const transaction = protobuf.Transaction.create({
    header: transactionHeaderBytes,
    headerSignature: this.signer.sign(transactionHeaderBytes),
    payload: payloadBytes
  });
  
  console.log("transacction")
  const transactions = [transaction];
  const  batchHeaderBytes = protobuf.BatchHeader.encode({
    signerPublicKey: this.signer.getPublicKey().asHex(),
    transactionIds: transactions.map((txn) => txn.headerSignature),
  }).finish();

  const batchSignature = this.signer.sign(batchHeaderBytes);
  const batch = protobuf.Batch.create({
    header: batchHeaderBytes,
    headerSignature: batchSignature,
    transactions: transactions,
  });

  const batchListBytes = protobuf.BatchList.encode({
    batches: [batch]
  }).finish();
console.log("restapi")
  this._send_to_rest_api(batchListBytes);	
}


async _send_to_rest_api(batchListBytes){
  if (batchListBytes == null) {
    try{
    var geturl = 'http://rest-api:8008/state/'+this.address
    console.log("Getting from: " + geturl);
    let response=await fetch(geturl, {
      method: 'GET',
    })
    let responseJson = await response.json();
      var data = responseJson.data;
      var newdata = new Buffer(data, 'base64').toString();
      return newdata;
    }
    catch(error) {
      console.error(error);
    }	
  }
  else{
    console.log("new code");
    try{
   let resp =await fetch('http://rest-api:8008/batches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream'},
      body: batchListBytes
      })
         console.log("response", resp);
      }
       catch(error) {
         console.log("error in fetch", error);
       
     } 
 }
}


}module.exports.UserClient = UserClient;