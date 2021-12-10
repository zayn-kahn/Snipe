var ethers = require("ethers");
const abiDecoder = require('./abi-decoder');
const required_Items = require('./cfg.json');
// const print = require('./ifelse')

const addresses = {// Necessary Address
  WETH: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
  R_router: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
  factory: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
  me: "0x328f9A19627FC376c95A852622798F5Ce2f43367"
}

//Necessary Interfaces
const mnemonic = required_Items.mnemonic;
const provider = new ethers.providers.WebSocketProvider(required_Items.wss_RETH)
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

var customWsProvider = new ethers.providers.WebSocketProvider(required_Items.wss_RETH);
var init = function () {

  customWsProvider.on("pending", async (tx) => {
    await customWsProvider.getTransaction(tx).then(async function (transaction) {
        
        abiDecoder.addABI(required_Items.routerABI, required_Items.FactoryABI)
        Data = await abiDecoder.decodeMethod(transaction.data);
        // console.log(transaction.from);
        if (await Data !== undefined && await Data !== null) {
          return;
        }
        else {
        if (await ethers.utils.getAddress(transaction.from) === '0x621812bF225D4A7bF6e2bCA6eBa63Ce957E3cDe9') { //await Data !== undefined && await Data !== null &&
          if (Data.name === 'addLiquidity' || Data.name === 'createPair'){//✅ Checked
          var  token0 = ethers.utils.getAddress(Data.params[0].value);
          var  token1 = ethers.utils.getAddress(Data.params[1].value);
            let InputToken, outputToken;
              if(token0 === addresses.WETH) {
                InputToken = token0;
                outputToken = token1;
                console.log("Position 1:",token0, token1)
              }
              else if (token1 === addresses.WETH) {
                  InputToken = token1;
                  outputToken = token0;
                  console.log("Position 2:",token1, token0)
              }
              // Neither token is WETH and we cannot purchase
              else if ( InputToken === undefined) {
                  console.log("No WETH Pair Detected")
                  return
              }
              const amountIn = ethers.utils.parseUnits('0.00001', 'ether'); //ether is the measurement, not the coin
              const amountsOut = await R_router.getAmountsOut(amountIn, [InputToken, outputToken]);
          
              const amountOutMin = amountsOut[1]
                  .mul(ethers.utils.parseUnits("20", 'ether'))
                  .div(ethers.utils.parseUnits("100", 'ether')); // math for Big numbers in JS
              console.log(amountIn, amountOutMin.toString())
              // const approve = await erc20.approve(R_router.address, amountIn);
              // console.log("Approval:", approve)
          
                  console.log(`
              ~~~~~~~~~~~~~~~~~~~~
              Buying new token
              ~~~~~~~~~~~~~~~~~~~~
              InputToken: ${amountIn.toString()} ${InputToken} (WETH)
              outputToken: ${amountOutMin.toString()} ${outputToken}
              `);
              const tx = await R_router.swapExactTokensForTokens(
                  amountIn,
                  amountOutMin,
                  [InputToken, outputToken],
                  addresses.me,
                  Date.now() + 1000 * 60 * 5, //5 minutes
                  {
                  gasPrice: transaction.gasPrice.toString()-1,
                  gasLimit: 250000
                  }
              );
              const receipt = await tx.wait();
              console.log('https://rinkeby.etherscan.io', tx.hash);
          }
          else {// For not our case
            console.log("RETURN for No LP")
            return;
          }
        }
        else {// For Null and Undefind
          console.log("Not the account")
          return;
        }
      }
        // console.timeEnd();
    });
    
  });
  
};

init();