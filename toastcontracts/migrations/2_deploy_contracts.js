var Strings = artifacts.require("./Strings.sol");
var ToastCoin = artifacts.require("./ToastCoin.sol");

module.exports = function(deployer) {
  deployer.deploy(Strings);
  deployer.link(Strings, ToastCoin);
  deployer.deploy(ToastCoin);
};
