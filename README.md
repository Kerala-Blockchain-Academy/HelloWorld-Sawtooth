# Sawtooth_HelloWorld

HelloWorld is a simple blockchain application written in JavaScript with Hyperledger Sawtooth. It provides very basic functionality like writing data to the blockchain network and reading that data from the same network. The data is stored at an 70 hex digit address derived from:

* a 6-hex character prefix (the "HelloWorld" Transaction Family namespace) and
* the first 64 hex characters of the SHA-512 hash of a public key in hex.

## Components

HelloWorld application is built with two parts, both written in JavaScript

* **Client** - The client is responsible for creating and signing transactions, combining those transactions into batches, and submitting them to the validator through REST-API module. In HelloWorld application, the client is a Node.js application (in express) which provides a web user interface for the user to ​‘write’​ a message and then ​‘read’​ it. The `app.js` is the main javascript file from where the `main` function call occurs. Handlebars are used for templating, client related CSS and JavaScript code is written in the `public` folder and server related files are written in `routes/` folder. The application dependencies and the commands to be executed are included in `DockerFile`.

* **Transaction** **Processor** - The ​transaction processor​ defines the business logic for our application. The transaction processor is responsible for registering with the validator, handling transaction requests and getting/setting state as needed. The transaction processor mainly has a Processor class and Handler class. In this HelloWorld application,​`helloworldprocessor` directory contains most of the business logic. `HelloWorldProcessor.js` is a generic class for communicating with a validator and routing transaction processing requests to a registered handler. `HelloWorldHandler.js` is the handler class which contains the business logic for the particular family of transactions. 

## Prerequisites

This example uses docker-compose and Docker containers. For installing Docker Engine and Docker Compose, please follow the instructions here: https://docs.docker.com/install/

**NOTE:** The preferred OS environment is Ubuntu Linux 16.04.3 LTS x64. Although other Linux distributions which support Docker should work.

## Getting Started

1. Open a command terminal and navigate to the directory where the sawtooth-helloworld code is present.

`cd sawtooth-helloworld`

2. Run the following command to start the HelloWorld application in Sawtooth Docker environment.

`sudo docker-compose up`

3. Open a browser and go to ​http://localhost:3000

4. Now you can enter the message in the textbox and click the `​Write`​ button. It will store the data in state and you can retrieve the message by clicking ​`Read` button.

5. To stop the validator and destroy the containers, type `^c` in the docker-compose window, wait for it to stop, then type

`sudo docker-compose down`

