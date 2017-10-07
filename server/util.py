
class Transaction:
    def __init__(self, sender, receiver, amount):
        self.sender = sender
        self.receiver = receiver
        self.amount = amount

def parse_balance_request(sender, body):
    if "balance" not in body.lower():
        raise Exception("balance not in request")

    return sender

def parse_transaction(sender, body):
    # expect string in the form: <amount> <receiver>
    tokens = body.split()
    if len(tokens) < 2:
        raise Exception("Expected: <amount> <receiver>")
    amount = float(tokens[0])
    receiver = " ".join(tokens[1:])
    return Transaction(sender, receiver, amount)