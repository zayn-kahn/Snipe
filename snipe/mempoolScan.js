var ethers = require("ethers");
// var Tx = require('ethereumjs-tx').Transaction;
const abiDecoder = require('./abi-decoder');
const required_Items = require('./cfg.json');
// const bot = require('./bot')

var customWsProvider = new ethers.providers.WebSocketProvider(required_Items.wss_RETH);
var init = function () {
  customWsProvider.on("pending", (tx) => {
    customWsProvider.getTransaction(tx).then(function (transaction) {
        abiDecoder.addABI(required_Items.routerABI, required_Items.FactoryABI)
        Data = abiDecoder.decodeMethod(transaction.data);
        if (Data !== null) { // && Data.name === 'addLiquidity|| Data.name' === 'swapETHForExactTokens'
          if (Data.name === 'swapExactTokenForTokens'){
            // return
            console.log("TransactionHash",transaction.hash)
            console.log("Decoded:", Data, `
            Func:`, Data.name, `
            Token0:`, token0 = Data.params[0].value,`
            Token1`, toeken1 = Data.params[1].value,`
            GasPrice:`, Gas = transaction.gasPrice.toString()-1, transaction.gasPrice.toString()); 
          }
          // else if (Data.name === 'swapTokensForExactTokens' || Data.name === 'swapExactTokenForTokens'){
          //   // return
          //   console.log("TransactionHash",transaction.hash)
          //   console.log("Decoded:", Data, `
          //   Func:`, Data.name, `
          //   Token0:`, token0 = Data.params[0].value,`
          //   Token1`, toeken1 = Data.params[1].value,`
          //   GasPrice:`, Gas = transaction.gasPrice.toString()-1, transaction.gasPrice.toString()); 
          // }
          // else if (Data.name === 'swapETHForExactTokens' || Data.name === 'swapExactETHForTokens'){
          //   // return
          //   console.log("TransactionHash",transaction.hash)
          //   console.log("Decoded:", Data, `
          //   Func:`, Data.name, `
          //   Token0:`, token0 = Data.params[1].value[0],`
          //   Token1`, toeken1 = Data.params[1].value[1],`
          //   GasPrice:`, Gas = transaction.gasPrice.toString()-1, transaction.gasPrice.toString());
          // }  
          // if (Data.name === 'swapExactTokensForETH' || Data.name === 'swapTokensForExactETH'){
          //   console.log("TransactionHash",transaction.hash)
          //   console.log("Decoded:", Data, `
          //   Func:`, Data.name, `
          //   Token0:`, token0 = Data.params[2].value[0],`
          //   Token1`, toeken1 = Data.params[2].value[1],`
          //   GasPrice:`, Gas = transaction.gasPrice.toString()-1, transaction.gasPrice.toString());
          // }
        }
    });
  });
};

init();