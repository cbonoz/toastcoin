"""
ToastCoin Web Server (Flask)
Async web server that responds to incoming text messages for creating new accounts and performing transactions on the blockchain.

Primary dependencies:
* twilio: https://www.twilio.com/docs/guides/how-to-receive-and-reply-in-python
* socketio: https://flask-socketio.readthedocs.io/en/latest/
* web3py: http://web3py.readthedocs.io/en/latest/contracts.html

Author: Chris Buonocore
"""
from flask import Flask, request, redirect, json, jsonify
from flask_socketio import SocketIO, send, emit
from twilio.twiml.messaging_response import MessagingResponse

# User libraries:
import util
from toastcoin import ToastCoin

app = Flask(__name__)
app.logger_name = 'toastcoin'
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

# create the web3 object instance (pointing to the deployed token contract)
# Address obtained from truffle deployment.
CONTRACT_ADDR = "0x604f34b251061af7919ed09319bdbbcd937cede5"
# MY_NUM = "6506302443"

toast_coin = ToastCoin(CONTRACT_ADDR)

@app.route("/sms", methods=['GET', 'POST'])
def sms_reply():
    """Process incoming text message commands"""
    number = request.form['From']
    number = number.strip("-")
    message_body = request.form['Body']

    message = None
    try:
        if toast_coin.is_unregistered(message_body):
            message = toast_coin.register(message_body)
        else:
            tokens = message_body.split()
            cmd = tokens[0].lower()
            if cmd == "send":
                from_addr = toast_coin.get_creator()
                amount = float(tokens[1])
                to_addr = toast_coin.get_addr(tokens[2])
                message = toast_coin.send_amount(from_addr, to_addr, amount)
            elif cmd == "balance":
                message = toast_coin.get_balance(" ".join(tokens[1:]))

        if message is not None:
            emit('activity', message)
        else:
            print("Unparseable incoming message (%s, %s)" % (number, message_body))

    except Exception as e:
        print(e)
        message = str(e)
    # Start our TwiML response (if we want to text message the user back)
    # resp = MessagingResponse()
    # Add a message
    # resp.message("The Robots are coming! Head for the hills!")
    # return str(resp)

@app.route('/register', methods = ['POST'])
def register():
    # data in string format and you have to parse into dictionary
    data = request.data
    print(data)
    dataDict = json.loads(data)
    message = None
    if 'name' in dataDict:
        name = dataDict['name']
        message = toast_coin.register(name)
        emit('activity', message)
    return jsonify(message)


@app.route('/balance', methods = ['GET'])
def balance():
    # data in string format and you have to parse into dictionary
    name = request.args.get('name', '')
    message = toast_coin.get_balance(name)
    emit('activity', message)
    return jsonify(message)


if __name__ == '__main__':
    socketio.run(app, host='localhost', port=9007)