var ethers = require("ethers");
const abiDecoder = require('./abi-decoder');
const required_Items = require('./cfg.json');
// const print = require('./ifelse')

const addresses = {// Necessary Address
  WETH: "0x83D19769e2781cBeBfCa59D807a8a314afa24285",
  R_router: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
  factory: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"
}

//Necessary Interfaces
const mnemonic = required_Items.mnemonic;
const provider = new ethers.providers.WebSocketProvider(required_Items.wss_Ropsten)
const wallet = ethers.Wallet.fromMnemonic(mnemonic);
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
        let swap = 0;
        abiDecoder.addABI(required_Items.routerABI)
var customWsProvider = new ethers.providers.WebSocketProvider(required_Items.wss_Ropsten);
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
               console.log('Transaction:', transaction ,`
               To`, transaction.to ,`
               Name`,Data.name ,`
               Router:` , swap++)
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
              const amountIn = ethers.utils.parseUnits('10', 'ether'); //ether is the measurement, not the coin
              const amountsOut = await R_router.getAmountsOut(amountIn, [InputToken, outputToken]);

              const amountOutMin = amountsOut[1]
                  .mul(ethers.utils.parseUnits("20", 'ether'))
                  .div(ethers.utils.parseUnits("100", 'ether')); // math for Big numbers in JS
            //   console.log(amountIn.toString(), amountOutMin.toString())
              // const approve = await erc20.approve(R_router.address, amountIn);
              // console.log("Approval:", approve)

                  console.log(`
              ~~~~~~~~~~~~~~~~~~~~
              Buying new token
              ~~~~~~~~~~~~~~~~~~~~
              InputToken: ${amountIn.toString()} ${InputToken}
              outputToken: ${amountOutMin.toString()} ${outputToken}
              `);
              console.log(transaction.gasPrice.toString(),
               transaction.gasPrice.toString() -1)
              const tx = await R_router.swapExactTokensForTokens(
                  amountIn,
                  amountOutMin,
                  [InputToken, outputToken],
                  account.address,
                  Math.floor(Date.now() / 1000) + 60 * 20, //20 minutes
                  {
                  gasLimit: transaction.gasLimit,
                  maxPriorityFeePerGas: transaction.maxPriorityFeePerGas-1,
                  }
              );
              console.log(transaction.gasPrice.toString(),
               transaction.gasPrice.toString() -1, tx.gasPrice, 
               tx.gasPrice -1
               )
              const receipt = await tx.wait();
              console.log(`MY TX: https://ropsten.etherscan.io/tx/${receipt.hash}`)
               console.log(tx.gasPrice, tx.gasPrice -1)
              console.log(`Target :https://ropsten.etherscan.io/tx/${transaction.hash}`)
              return;}
           }
      }
  }});
};

init();