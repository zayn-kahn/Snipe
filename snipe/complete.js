var ethers = require("ethers");
const abiDecoder = require('./abi-decoder');
const required_Items = require('./cfg.json');
// const print = require('./ifelse')

const addresses = {// Necessary Address
    WETH: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",//WETH 0xc778417E063141139Fce010982780140Aa0cD5Ab
    R_router: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1",//Router 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
    factory: "0x6725F303b657a9451d8BA641348b6761A6CC7a17",//Facory 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f
    token: '0xe7c6d08f02c264a96bb02313ac374f55c9a40e1d'
  }

//Necessary Interfaces
const mnemonic = required_Items.mnemonic;
const provider = new ethers.providers.WebSocketProvider(required_Items.wss_TBSC)
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
        
        abiDecoder.addABI(required_Items.routerABI)
var customWsProvider = new ethers.providers.WebSocketProvider(required_Items.wss_TBSC);
var init = function () {

  customWsProvider.on("pending", async (tx) => {
      let transaction = await customWsProvider.getTransaction(tx)
      if (!transaction) {// transaction nature check
        return;
      }
      else{// transaction type check
        Data = await abiDecoder.decodeMethod(transaction.data);
        // console.log();
          if (!Data){//✅ Checked Data.name === 'addLiquidity' || 
            return;} else if (Data.name === 'addLiquidity'){
              console.time("-1 Gwei")  
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
              const amountIn = ethers.utils.parseUnits('0.0001', 'ether'); //ether is the measurement, not the coin
  //                 console.log(`
  //             ~~~~~~~~~~~~~~~~~~~~
  //             Buying new token
  //             ~~~~~~~~~~~~~~~~~~~~
  // InputToken: ${amountIn.toString()} ${InputToken}`);
  //             console.log(account.address)

              const tx = await R_router.swapExactTokensForTokens(
                  amountIn,
                  0,
                  [InputToken, outputToken],
                  account.address,
                  Date.now() + 1000 * 60 * 5, //5 minutes
                  {
                    gasPrice: transaction.gasPrice-1,
                    gasLimit: transaction.gasLimit
                  }
              );
              console.log(`BackRun:  https://testnet.bscscan.com/tx/${tx.hash}`)
              console.timeEnd("-1 Gwei")
              console.time("Approve")
              const erc = new ethers.Contract(
                outputToken,
                required_Items.ERC20,
                account
            )

              sellAmount = await erc.balanceOf(account.address)
              console.log(sellAmount.toString())
            await erc.approve(addresses.R_router ,sellAmount)
            console.timeEnd("Approve")
            console.time("Sell")
              const sell = await R_router.swapExactTokensForTokens(
                sellAmount,
                0,
                [outputToken, InputToken],
                account.address,
                Date.now() + 1000 * 60 * 5, //5 minutes
                {
                  gasPrice: 5*transaction.gasPrice,
                  gasLimit: transaction.gasLimit
                }
            );

              console.timeEnd("Sell")  
              const receipt = await tx.wait();
              //  console.log(tx.gasPrice, tx.gasPrice -1)
              console.log(`FrontSell:  https://testnet.bscscan.com/tx/${sell.hash}`)
              return;}
           }
      }
  });
};

init();