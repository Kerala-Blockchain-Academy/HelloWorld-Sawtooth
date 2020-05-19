const { createHash } = require('crypto')
const { CryptoFactory, createContext } = require('sawtooth-sdk/signing')
const protobuf = require('sawtooth-sdk/protobuf')
const fetch = require('node-fetch');
const { Secp256k1PrivateKey } = require('sawtooth-sdk/signing/secp256k1')
const { TextEncoder, TextDecoder } = require('text-encoding/lib/encoding')


const FAMILY_NAME = "HelloWorld";
const FAMILY_VERSION = "1.0";
const privateKeyHex = "66ad89d0ff29b0267fba72ea8d40ef7975e10f8acde8d50d20cdf56ba9599c5e";

// function to calculate hash of data
function hash(v) {
  return createHash('sha512').update(v).digest('hex');
}

class UserClient {
  constructor() {
    const context = createContext('secp256k1');
    const secp256k1pk = Secp256k1PrivateKey.fromHex(privateKeyHex.trim());
    this.signer = new CryptoFactory(context).newSigner(secp256k1pk);
    this.publicKey = this.signer.getPublicKey().asHex();
    this.address = hash(FAMILY_NAME).substr(0, 6) + hash(this.publicKey).substr(0, 64);
    console.log("Storing at: " + this.address);
  }

  //function to process write request
  send_data(payload) {

    const address = this.address;
    var inputAddressList = [address];
    var outputAddressList = [address];
    var encode = new TextEncoder('utf8');
    const payloadBytes = encode.encode(payload);

    /*create transaction header
        parameter : 
            familyName -  the transaction family name
            familyVersion - Version of the TP,
            inputs - the addresses that can be read from the ledger in this transaction
            outputs - the addresses that are allowed to update by this transaction
            signerPublicKey - who is signing the transaction
            batcherPublicKey - who is signing this batch of transaction
            nonce - for the uniqueness of the transaction
            dependencies - any other transactions that current transaction is depending on
            payloadSha512 - SHA512 Hash of the payload in order to verify if the payload is received properly at TP
    */
    const transactionHeaderBytes = protobuf.TransactionHeader.encode({
      familyName: FAMILY_NAME,
      familyVersion: FAMILY_VERSION,
      inputs: inputAddressList,
      outputs: outputAddressList,
      signerPublicKey: this.signer.getPublicKey().asHex(),
      nonce: "" + Math.random(),
      batcherPublicKey: this.signer.getPublicKey().asHex(),
      dependencies: [],
      payloadSha512: hash(payloadBytes),
    }).finish();

    // create transaction
    const transaction = protobuf.Transaction.create({
      header: transactionHeaderBytes,
      headerSignature: this.signer.sign(transactionHeaderBytes),
      payload: payloadBytes
    });
    const transactions = [transaction];

    //create batch header
    const batchHeaderBytes = protobuf.BatchHeader.encode({
      signerPublicKey: this.signer.getPublicKey().asHex(),
      transactionIds: transactions.map((txn) => txn.headerSignature),
    }).finish();

    const batchSignature = this.signer.sign(batchHeaderBytes);

    //create batch
    const batch = protobuf.Batch.create({
      header: batchHeaderBytes,
      headerSignature: batchSignature,
      transactions: transactions,
    });

    //create batchlist
    const batchListBytes = protobuf.BatchList.encode({
      batches: [batch]
    }).finish();

    //calling the function to submit transaction to REST API
    this._send_to_rest_api(batchListBytes);
  }


  async _send_to_rest_api(batchListBytes) {
    if (batchListBytes == null) {
      try {
        var geturl = 'http://rest-api:8008/state/' + this.address  //endpoint used to retrieve data from an address in Sawtooth blockchain
        console.log("Getting from: " + geturl);
        let response = await fetch(geturl, {
          method: 'GET',
        })
        let responseJson = await response.json();
        var data = responseJson.data;
        var newdata = new Buffer(data, 'base64').toString();
        return newdata;
      }
      catch (error) {
        console.error(error);
      }
    }
    else {
      try {
        let resp = await fetch('http://rest-api:8008/batches', { //endpoint to which we write data in a Sawtooth blockchain
          method: 'POST',
          headers: { 'Content-Type': 'application/octet-stream' },
          body: batchListBytes
        })
        console.log("response--", resp);
      }
      catch (error) {
        console.log("error in fetch", error);

      }
    }
  }
}
module.exports.UserClient = UserClient;