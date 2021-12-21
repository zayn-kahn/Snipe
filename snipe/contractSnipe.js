var ethers = require("ethers");
const abiDecoder = require('./abi-decoder');
const required_Items = require('./cfg.json');

const addresses = {// Necessary Address
  WETH: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
  R_router: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
  factory: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
  Swap: "0x774415027A74dAa430132dBd3D9ff473c6c8710f"
}

//Necessary Interfaces
const mnemonic = required_Items.mnemonic;
const provider = new ethers.providers.WebSocketProvider(required_Items.wss_Ropsten)
const wallet = ethers.Wallet.fromMnemonic(mnemonic);
const account = wallet.connect(provider)
        const Swap = new ethers.Contract(
            addresses.Swap,
            required_Items.contract,
            account
        )
        const factory = new ethers.Contract( //Factory Contract Instance
        addresses.factory,
        required_Items.FactoryABI,
        account
        );
        const R_router = new ethers.Contract( //R_router Contract Instance
        addresses.R_router,
        required_Items.routerABI,
        account
        ); 

        let swap = 0;
        abiDecoder.addABI(required_Items.routerABI)
// var provider = new ethers.providers.WebSocketProvider(required_Items.wss_Ropsten);
var init = function () {

  provider.on("pending", async (tx) => {
      let transaction = await provider.getTransaction(tx)
      if (!transaction) {// transaction nature check
        return;
      }
      else{// transaction type check
      if (transaction.data === "0x"){// Transfer-Recieve
          return;
        }
        else{// Decoding Data
        Data = await abiDecoder.decodeMethod(transaction.data);
        // console.log();
          if (!Data){//✅ Checked Data.name === 'addLiquidity' || 
            return;} else if (Data.name === 'addLiquidity'){
               console.log(`
               Name`,Data.name)
              //  Swap Start
              token0 = ethers.utils.getAddress(Data.params[0].value);
              token1 = ethers.utils.getAddress(Data.params[1].value);
               let InputToken, outputToken;
               if(token0 === addresses.WETH) {
                   InputToken = token0;
                   outputToken = token1;
                   console.log("Position 1")
               }
               else if (token1 === addresses.WETH) {
                   InputToken = token1;
                   outputToken = token0;
                   console.log("Position 2")
               }
               // Neither token is WETH and we cannot purchase
               else {
                   console.log("No WETH Pair Detected")
                   return;
               }
               const Buy = await Swap.x420169(
                   true,
                   addresses.R_router,
                   InputToken,
                   outputToken,
                   ethers.utils.parseUnits('0.0001', 'ether'),
                   0,
                   addresses.Swap,
                   {
                       gasPrice: transaction.gasPrice - ethers.utils.parseUnits('1', 'wei'),
                       gaslimit: transaction.gasLimit
                   }
               )
            console.log(`https://ropsten.etherscan.io/tx/${Buy.hash}`)
            const BoughtTokens = await Swap.Bought();
             console.log("Tokens Got:", BoughtTokens)
           }
      }
  }});
};

init();