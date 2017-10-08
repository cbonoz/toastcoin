pragma solidity ^0.4.15;

// @title ToastCoin
contract ToastCoin {
	// Constants.
	uint constant START_BALANCE = 10000;

	// Mappings.
	mapping (address => uint) balances;
	mapping (address => string) names;

	uint accounts;
	address creator;

	// Events (these are added to the blockchain)
	event Transfer(address indexed _from, address indexed _to, uint256 _value);
	// event Register(address indexed _acc);

	function ToastCoin() {
		accounts = 0;
		creator = tx.origin;
		balances[creator] = START_BALANCE;
	}

	// Helper methods.

	function isEmpty(string s) private returns (bool) {
		return bytes(s).length == 0;
	}

	function getStartingAmount() returns(uint) {
		return 10;
	}

	// By default these methods below are public. 
	// Transactional Methods.

	function register(string name, address addr) returns(bool success) {
		// name must be non-empty and not registered yet.
		require(!isEmpty(name)); 
		require(isEmpty(names[addr]));

		accounts += 1;
		names[addr] = name;
		Transfer(creator, addr, getStartingAmount());
		return true;
	}

	function sendCoin(address receiver, uint amount) returns(bool sufficient) {
		sendCoin(msg.sender, receiver, amount);
	}

	function sendCoin(address sender, address receiver, uint amount) returns(bool sufficient) {
		if (balances[sender] < amount) {
			return false;
		}
		balances[sender] -= amount;
		balances[receiver] += amount;
		Transfer(sender, receiver, amount);
		return true;
	}

	// Query Methods.

	function isUnregistered(address addr) constant returns(bool registered) {
		return isEmpty(names[addr]); // non-empty if registered
	}

	function getBalance(address addr) constant returns(uint) {
		return balances[addr];
	}

	function getCreator() constant returns(address) {
		return creator;
	}
}