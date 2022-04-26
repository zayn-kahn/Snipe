var ethers = require("ethers");
const abiDecoder = require('./abi-decoder');
const required_Items = require('./cfg.json');

abiDecoder.addABI(required_Items.routerABI);
var customWsProvider = new ethers.providers.WebSocketProvider("wss://ftm.getblock.io/mainnet/?api_key=512aed0a-647a-49e5-8a9e-b6d432a653ee");
var init = function () {
  customWsProvider.on("pending", (tx) => {
    customWsProvider.getTransaction(tx).then(function (transaction) {
      if (!transaction){
        return}
        else{
          console.log("Transaction")
          Decode = abiDecoder.decodeMethod(transaction.data)
          if (Decode !==undefined){
          console.log(transaction)
          console.log(Decode)
        }
        return 
      }
    });
  });
};

init();