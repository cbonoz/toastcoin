'use strict';
const library = (function () {

    const DEFAULT_BALANCE = 100;

    const random = (arr) => {
        return arr[Math.round(Math.random() * (arr.length - 1))];
    };

    // return a query for a list of users.
    function listUsers() {
        return `select * from Users`;
    }

    function addAmountToUser(amount, user) {
        return `Update * from Users where user='${user}' set balance=balance+${amount}`;
    }

    function addNewUser(user) {
        return `insert ($user, balance) into Users`;
    }

    function sendAmount(source, destination, amount) {
        // TODO: implement.
        return ``;
    }

    return {
        random: random,
        addAmountToUser: addAmountToUser,
        addNewUser: addNewUser,
        sendAmount: sendAmount,
        listUsers: listUsers
    };

})();
module.exports = library;