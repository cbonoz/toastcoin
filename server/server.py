"""
ToastCoin Web Server (Flask)
Async web server that responds to incoming text messages for creating new accounts and performing transactions on the blockchain.

Primary dependencies:
* twilio: https://www.twilio.com/docs/guides/how-to-receive-and-reply-in-python
* socketio: https://github.com/miguelgrinberg/python-socketio
* web3py

Author: Chris Buonocore
"""
import socketio
import eventlet
import eventlet.wsgi
from flask import Flask, request, redirect
from twilio.twiml.messaging_response import MessagingResponse

# User libraries:
import util
from toastcoin import ToastCoin

sio = socketio.Server()
app = Flask(__name__)

# create the web3 object instance (pointing to the deployed token contract)
CONTRACT_ADDR = "1" # TODO: add real address

toast_coin = ToastCoin(CONTRACT_ADDR)

@app.route("/sms", methods=['GET', 'POST'])
def sms_reply():
    """Process incoming text messages"""
    number = request.form['From']
    message_body = request.form['Body']

    message = None
    if not toast_coin.is_registered(number):
        name = message_body 
        message = toast_coin.register(number, name)
    elif util.is_transaction(message_body):
        transaction = util.parse_transaction(message_body)
        message = toast_coin.send_amount(transaction.sender, transaction.receiver, transaction.amount)
    elif util.is_balance_request(message_body):
        message = toast_coin.get_balance(number)

    if message is not None:
        sio.emit('message', message)
    else:
        print("Unparseable incoming message (%s, %s)" % (number, message_body))

    # Start our TwiML response
    # resp = MessagingResponse()
    # Add a message
    # resp.message("The Robots are coming! Head for the hills!")
    # return str(resp)

@sio.on('connect', namespace='/toastcoin')
def connect(sid, environ):
    print("connect ", sid)

# @sio.on('register', namespace='/toastcoin')
# def message(sid, data):
#     print("register: ", data)
#     sio.emit('reply', room=sid)

# @sio.on('transaction', namespace='/toastcoin')
# def message(sid, data):
#     print("transaction: ", data)
#     sio.emit('reply', room=sid)

@sio.on('disconnect', namespace='/toastcoin')
def disconnect(sid):
    print('disconnect ', sid)

if __name__ == '__main__':
    # wrap Flask application with engineio's middleware
    app = socketio.Middleware(sio, app)
    # deploy as an eventlet WSGI server
    eventlet.wsgi.server(eventlet.listen(('', 8000)), app)
