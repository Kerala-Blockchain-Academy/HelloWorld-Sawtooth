const { TextEncoder, TextDecoder } = require('text-encoding/lib/encoding')
const { TransactionHandler } = require('sawtooth-sdk/processor/handler')
const crypto = require('crypto');

var encoder = new TextEncoder('utf8')
var decoder = new TextDecoder('utf8')

const FAMILY_NAME = "HelloWorld";
const NAMESPACE = hash(FAMILY_NAME).substring(0, 6);

// function to hash data
function hash(v) {
    return crypto.createHash('sha512').update(v).digest('hex');
}

/* function to write data to state 
parameter : 
    context -  validator context object
    address - address to which data should be written to
    msg - the data to be written
*/
function writeToStore(context, address, msg) {
    let msgBytes = encoder.encode(msg);
    let entries = {
        [address]: msgBytes
    }
    return context.setState(entries);
}

//transaction handler class
class HelloWorldHandler extends TransactionHandler {
    constructor() {
        super(FAMILY_NAME, ['1.0'], [NAMESPACE]);
    }

    //apply function - execution starts here when a transaction reaches the validator for this transaction proceesssor
    apply(transactionProcessRequest, context) {
        var msg = decoder.decode(transactionProcessRequest.payload);
        let header = transactionProcessRequest.header
        this.publicKey = header.signerPublicKey
        console.log('msg ====================================' + msg);
        this.address = hash(FAMILY_NAME).substr(0, 6) + hash(this.publicKey).substr(0, 64);
        return writeToStore(context, this.address, msg);
    }
}
module.exports = HelloWorldHandler;