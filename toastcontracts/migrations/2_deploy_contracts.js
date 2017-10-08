var ToastCoin = artifacts.require("./ToastCoin.sol");

module.exports = function(deployer) {
  deployer.deploy(ToastCoin);
};
