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
        // console.log('transaction.data:', transaction.data)
        let Data = await abiDecoder.decodeMethod(transaction.data);
        if (!Data) {
                console.log("N || U:", 'j', j++)
                return;
        }
        else{
        console.log(Data, 'i:', i++)
        //   if (Data.name === 'swapETHForExactTokens'){
        //     console.log("Decoded:", Data.name, 'k',k++)}
        //     else if(Data.name === 'addLiquidity'){
        //       console.log("Decoded:", Data.name, 'k', k++)}
        //       else{
        //         return;
        //       }
        }
    });
  };
;

init();