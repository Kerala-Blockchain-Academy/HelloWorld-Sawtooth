const { TransactionProcessor } = require('sawtooth-sdk/processor');
const HelloWorldHandler = require('./HelloWorldHandler');

const address = 'tcp://validator:4004';
console.log('Connected---------------------------------------------------------------------');
const transactionProcesssor = new TransactionProcessor(address);
transactionProcesssor.addHandler(new HelloWorldHandler());
transactionProcesssor.start();