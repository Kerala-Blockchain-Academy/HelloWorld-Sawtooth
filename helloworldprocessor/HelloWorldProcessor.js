const { TransactionProcessor } = require('sawtooth-sdk/processor');
const HelloWorldHandler = require('./HelloWorldHandler');

const address = 'tcp://validator:4004'; //address of the validator from the docker-compose file
const transactionProcesssor = new TransactionProcessor(address);
transactionProcesssor.addHandler(new HelloWorldHandler()); //our Handler class is added here
transactionProcesssor.start(); //our transaction processsor will start listening for incoming transactions.