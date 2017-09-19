'use strict';
const library = (function () {

    const baseUrl = "http://blackshoalgroup.com:9006";
    const socketUrl = "http://blackshoalgroup.com:9007";

    function getActivity() {
        return `${baseUrl}/activity`;
    }

    function getUsers() {
        return `${baseUrl}/users`;
    }

    return {
        baseUrl: baseUrl,
        socketUrl: socketUrl,
        getUsers: getUsers,
        getActivity: getActivity
    };

})();
module.exports = library;