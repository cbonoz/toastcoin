const http = require('http');
const express = require('express');

// Twilio Credentials (env)
const accountSid = process.env.TWILIO_ACC;
const authToken = process.env.TWILIO_KEY;

// Require the Twilio module and create a REST client
const twilio = require('twilio');
const MessagingResponse = twilio.twiml.MessagingResponse;
const twilioClient = twilio(accountSid, authToken);

// socketio
const io = require('socket.io')();

// my libraries.
const queries = require('./queries');

// create the express app context.
const app = express();

// ** Routes ** //

app.post('/sms', (req, res) => {
  const twiml = new MessagingResponse();

  twiml.message('The Robots are coming! Head for the hills!');

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

app.get('/sms/listUsers', (req, res) => {
    const query = queries.listUsers();
});

app.post('/sms/addUser', (req, res) => {
    const user = '';
    const query = queries.addNewUser(user);
});

app.post('/sms/sendAmount', (req, res) => {
    const source = '';
    const destination = '';
    const amount = '';
    const query = queries.sendAmount(source, destination, amount);

    // TODO: execute the query and send a response back to the user.
});

// ** Socket IO ** //

// TODO: determine how to listen for icoming text messages and 
// emit events back to the connected client browsers.
io.on('connection', (client) => {
    // here you can start emitting events to the client 
    client.on('activity', (interval) => {
        console.log('client is subscribing to timer with interval ', interval);
      });
});
// ** DB ** // 

// Create and connect to the Postgres DB with the table Users (DB: toastcoin)
const { Client } = require('pg')
const client = new Client()
client.connect()

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