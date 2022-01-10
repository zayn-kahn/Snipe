var ethers = require("ethers");
// var Tx = require('ethereumjs-tx').Transaction;
const abiDecoder = require('./abi-decoder');
const required_Items = require('./cfg.json');

var customWsProvider = new ethers.providers.WebSocketProvider(required_Items.wss_bsc);
// var filter = { 
//   fromBlock: "pending",
//   toBlock: "latest",
//   address: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D" //uniswap Router
// };
var init = function () {
  customWsProvider.on("pending", (tx) => {
    customWsProvider.getTransaction(tx).then(function (transaction) {
      if (!transaction){
        return}
        else{
        abiDecoder.addABI(required_Items.routerABI)
        Data = abiDecoder.decodeMethod(transaction.data);
        if (!Data) { // && Data.name === 'addLiquidity|| Data.name' === 'swapETHForExactTokens'
            return}
          else {
            console.log("Transaction",transaction)
            console.log("Decoded:", transaction.data,
             `
            Func:`, Data, `
            Token0:`, token0 = Data.params[0].value,`
            Token1`, toeken1 = Data.params[1].value,`
            GasPrice:`, Gas = transaction.gasPrice.toString()-1,
            (transaction.gasPrice - 1).toString(), transaction.gasPrice.toString()
            );}
          }
    });
  });
};

init();