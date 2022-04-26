var ethers = require("ethers");
// var Tx = require('ethereumjs-tx').Transaction;
const abiDecoder = require('./abi-decoder');
const required_Items = require('./cfg.json');

var i =0;
var j =0;
var k =0;
abiDecoder.addABI(required_Items.routerABI) 

var customWsProvider = new ethers.providers.WebSocketProvider(required_Items.wss_RETH);
var init = function () {
  customWsProvider.on("pending", async (tx) => {
   let transaction = await customWsProvider.getTransaction(tx)
        let Data = abiDecoder.decodeMethod(transaction.data);
        if (!transaction && !Data) {
                console.log("N || U:", 'j', j++)
                return;
        }
        else{
        console.log(Data, 'i:', i++)
        console.log(Data)
        }
    });
  };
;

init();