var ethers = require("ethers");
// var Tx = require('ethereumjs-tx').Transaction;
const abiDecoder = require('./abi-decoder');
const required_Items = require('./cfg.json');
// const bot = require('./bot')

var customWsProvider = new ethers.providers.WebSocketProvider(required_Items.wss_BSC);
var init = function () {
  customWsProvider.on("pending", (tx) => {
    customWsProvider.getTransaction(tx).then(function (transaction) {
      if (!transaction){
        return}
      //   else{
      // console.log("TransactionHash",transaction.hash)
      //       console.log(`
      //       GasPrice:`, Gas = 1921402279);
      //     console.log()}
      // return
        abiDecoder.addABI(required_Items.routerABI)
        Data = abiDecoder.decodeMethod(transaction.data);
        if (!Data) { // && Data.name === 'addLiquidity|| Data.name' === 'swapETHForExactTokens'
            return}
          else if (Data.name === "swapExactTokensForTokens" || Data.name === "swapExactETHForTokens"){
            console.log("TransactionHash",transaction.hash)
            console.log("Decoded:", Data,
             `
            Func:`, Data.name, `
            Token0:`, token0 = Data.params[0].value,`
            Token1`, toeken1 = Data.params[1].value,`
            GasPrice:`, Gas = transaction.gasPrice.toString()-1,
            (transaction.gasPrice - 1).toString(), transaction.gasPrice.toString()
            );} 
    });
  });
};

init();