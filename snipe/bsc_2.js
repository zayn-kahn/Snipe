var ethers = require("ethers");
const abiDecoder = require('./abi-decoder');
const required_Items = require('./cfg.json');
// const print = require('./ifelse')

const addresses = {// Necessary Address
  WETH: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",//WETH 0xc778417E063141139Fce010982780140Aa0cD5Ab
  R_router: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1",//Router 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
  factory: "0x6725F303b657a9451d8BA641348b6761A6CC7a17",//Facory 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f
  me: "0x328f9A19627FC376c95A852622798F5Ce2f43367"
}

//Necessary Interfaces
const mnemonic = required_Items.mnemonic;
const provider = new ethers.providers.WebSocketProvider(required_Items.wss_TBSC)
const wallet = ethers.Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/3`);
const account = wallet.connect(provider)
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

        abiDecoder.addABI(required_Items.routerABI)
var customWsProvider = new ethers.providers.WebSocketProvider(required_Items.wss_TBSC);
var init = function () {

  customWsProvider.on("pending", async (tx) => {
      let transaction = await customWsProvider.getTransaction(tx)
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
              console.time("Same")
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
               if (!InputToken){
                 return;
               }else{
              const amountIn = ethers.utils.parseUnits('0.00001', 'ether'); //ether is the measurement, not the coin
                  console.log(`
              ~~~~~~~~~~~~~~~~~~~~
              Buying new token
              ~~~~~~~~~~~~~~~~~~~~
  InputToken: ${amountIn.toString()} ${InputToken}
`);

              const tx = await R_router.swapExactTokensForTokens(
                  amountIn,
                  0,
                  [InputToken, outputToken],
                  addresses.me,
                  Date.now() + 1000 * 60 * 5, //5 minutes
                  {
                    gasPrice: transaction.gasPrice,
                    gasLimit: transaction.gasLimit
                  }
              );console.timeEnd("Same")
              // console.log(transaction.gasPrice.toString(),
              //  transaction.gasPrice.toString() -1, tx.gasPrice, 
              //  tx.gasPrice -1
              //  )
              const receipt = await tx.wait();
              console.log(`We did:  https://testnet.bscscan.com/tx/${tx.hash}`)
              //  console.log(tx.gasPrice, tx.gasPrice -1)
              console.log(`We capture:  https://testnet.bscscan.com/tx/${transaction.hash}`)
              return;}
           }
      }
  }});
};

init();