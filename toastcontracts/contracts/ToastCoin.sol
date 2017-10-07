pragma solidity ^0.4.15;

import "./Strings.sol";

// @title ToastCoin
contract ToastCoin {
	using strings for *; // import methods from Strings.sol

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

	function getStartingAmount() returns(uint) {
		return 10;
	}

	// By default these methods below are public. 
	// Transactional Methods.

	function register(address addr, string name) returns(bool success) {
		// name must be non-empty and not registered yet.
		require(!name.toSlice().empty()); 
		require(names[addr].toSlice().empty());

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

	function isUnregistered(address addr) returns(bool registered) {
		return names[addr].toSlice().empty(); // non-empty if registered
	}

	function getBalance(address addr) returns(uint) {
		return balances[addr];
	}
}