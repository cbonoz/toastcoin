const crypto = require('crypto');
const http = require('http');
const express = require('express');

// Twilio Credentials (env)
const accountSid = process.env.TWILIO_ACC;
const authToken = process.env.TWILIO_KEY;

// Require the Twilio module and create a REST client
// const twilio = require('twilio');
// const MessagingResponse = twilio.twiml.MessagingResponse;
// const twilioClient = twilio(accountSid, authToken);

const solc = require("solc");
const fs = require('fs');

// console.log(web3); 

// socketio
const io = require('socket.io')();

// my libraries.
// const queries = require('./queries');

// create the express app context.
const app = express();

// ** Web3 setup ** //

const CONTRACT_ADDR =  '0xc782a84527ffc4e3e2329eb0dd8637db4165a5cf';

var Web3 = require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider('http://0.0.0.0:8545'));
// Read standard token contract from https://www.ethereum.org/token
const solFile = './../toastcontracts/contracts/ToastCoin.sol';
// const solFile = './../toastcontracts/build/contracts/ToastCoin.json';
let source = fs.readFileSync(solFile, 'utf8');
let compiledContract = solc.compile(source, 1);
// console.log('contract', compiledContract)
let abi = compiledContract.contracts[':ToastCoin'].interface;
let bytecode = compiledContract.contracts[':ToastCoin'].bytecode;
let gasEstimate = web3.eth.estimateGas({data: bytecode});
// Create a proxy object to access the smart contract
let toastContract = new web3.eth.Contract(JSON.parse(abi), CONTRACT_ADDR);

toastContract.options.address = CONTRACT_ADDR;
console.log('ToastContract', toastContract);
// instantiate by address
// const toastContract = ToastContract.new(CONTRACT_ADDR);

toastContract.methods.getStartingAmount().call({from: CONTRACT_ADDR}, (err, res) => {
    console.log('startingAmount', err, res);
});
toastContract.methods.getCreator().call({from: CONTRACT_ADDR}, (err, res) => {
    console.log('getCreator', err, res);
});

function getAddr(key) {
    const hash = crypto.createHash('sha1').update(key).digest('hex').slice(0,20)
    console.log('createhash', key, hash);
    return hash;
}

// ** Routes ** //

app.post('/tc', (req, res) => {
    const body = req.body.Body;
    const phoneNumber = body.From;
    console.log('Received message from ' + phoneNumber + ': ' + body);

    try {
        var message = null;
        const bodyAddr = getAddr(body);
        if (toastContract.isUnregistered(bodyAddr)) {
            toastContract.register(body, bodyAddr);
        } else {
            const tokens = body.split();
            const cmd = tokens[0].toLowerCase()
            switch (cmd) {
                case "send":
                    // form: send <amount> <toAddr>
                    const fromAddr = toastContract.getCreator();
                    const amount = parseInt(tokens[1])
                    const toAddr = getAddr(tokens[2])
                    console.log('send', fromAddr, amount, toAddr);
                    // TODO: finish
                    message = toastContract.sendCoin(fromAddr, toAddr, amount);
                    break;
                case "balance":
                    console.log('balance', body);
                    message = toastContract.getBalance()
                    break;
            }
        }

        if (message != null) {

        } else {
            console.log("Unparseable message (" + phoneNumber + ", " + body);
        }
    } catch (err) {
        console.log('err: ' + err);

    }
    // TODO: determine if return value necessary here.

    // Only need for replying back to the user with a text message.
//   const twiml = new MessagingResponse();
//   twiml.message('The Robots are coming! Head for the hills!');
//   res.writeHead(200, {'Content-Type': 'text/xml'});
//   res.end(twiml.toString());
});
app.get('/tc/balance', (req, res) => {
    const user = '';
    console.log('balance')
});

app.get('/tc/register', (req, res) => {
    const name = req.body.name;
    res = false
    if (name != null && name != undefined) {
        const addr = getAddr(name);
        console.log('register', addr, name);
        res = toastContract.register(name, addr);
    }
    return JSON.stringify({success: res});
});

// ** Socket IO ** //

// ** DB ** // 

// Create and connect to the Postgres DB with the table Users (DB: toastcoin)
// const { Client } = require('pg')
// const client = new Client()
// client.connect()

// client.query('SELECT $1::text as message', ['Hello world!'], (err, res) => {
//   console.log(err ? err.stack : res.rows[0].message) // Hello World!
//   client.end()
// });

// ** Server ** //
const port = 9006;
const socketPort = 9007;

http.createServer(app).listen(port, () => {
    console.log('Express server listening on port', port);
    io.listen(socketPort);
    console.log('socket listening on port ', socketPort);
});