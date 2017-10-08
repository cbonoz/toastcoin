
class Transaction:
    def __init__(self, sender, receiver, amount):
        self.sender = sender
        self.receiver = receiver
        self.amount = amount

def parse_transaction(tokens):
    # expect string in the form: <amount> <receiver>
    if len(tokens) < 3:
        raise Exception("Expected: send <amount> <receiver>")
    amount = float(tokens[1])
    receiver = " ".join(tokens[2:])
    return Transaction(sender, receiver, amount)