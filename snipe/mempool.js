var ethers = require("ethers");
// var Tx = require('ethereumjs-tx').Transaction;
const abiDecoder = require('./abi-decoder');
const required_Items = require('./cfg.json');

var customWsProvider = new ethers.providers.WebSocketProvider(required_Items.wss_TBSC);
var init = function () {
  customWsProvider.on("pending", (tx) => {
    customWsProvider.getTransaction(tx).then(function (transaction) {
      console.log(transaction)
      console.log(transaction.gasPrice.toString()-1)
      ethers.utils.parseUnits(transaction.gasPrice.toString()-1, 'gwei')
        abiDecoder.addABI(required_Items.routerABI)
        // console.log(transaction.data)
        Data = abiDecoder.decodeMethod(transaction.data);
        if (Data === undefined) {
                // console.log("return")
                return;
        }
        else {
            console.log("Decoded:", Data);
        }
    });
  });
};

init();