from web3 import Web3, HTTPProvider, IPCProvider
from hashlib import blake2b
import json

class ToastCoin:

    def __init__(self, contract_addr, abi_file='abi.json', host='http://localhost:8545'):
        self.web3 = Web3(HTTPProvider(host))
        self.contract_addr = contract_addr
        with open(abi_file, 'r') as abi_definition:
            abi = json.load(abi_definition)
        print("Current block number: %d" % self.web3.eth.blockNumber)
        self.contract = self.web3.eth.contract(abi, self.contract_addr)
        self.hashgen = blake2b(digest_size=20)

    def get_addr(self, key):
        return self.hashgen(key).hexdigest()

    # Below methods return a human readable success/fail message.

    def register(self, number):
        addr = self.get_addr(number)
        res = False
        if self.contract.call().isUnregistered(addr):
            res = self.contract.transact().register(addr)

        if res:
            return "Welcome: %s" % name
        return None

    def send_amount(self, from_addr, to_addr, amount):
        amount = int(amount)
        res = self.contract.transact().sendCoin(from_addr, to_addr, amount)
        if res:
            return "%s sent %d to %s" % (sender, amount, receiver)
        return None

    # State methods below.

    def get_balance(self, name):
        addr = self.get_addr(name)
        res = self.contract.call().getBalance(addr)
        if res:
            return "%s has %d ToastCoin" % (name, res)
        return None



