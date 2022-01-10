var ethers = require("ethers");
const abiDecoder = require('abi-decoder');
const required_Items = require('../snipe/cfg.json');
// const print = require('./ifelse')

const addresses = {// Necessary Address
  WETH: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",//WETH 0xc778417E063141139Fce010982780140Aa0cD5Ab
  R_router: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1",//Router 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
  factory: "0x6725F303b657a9451d8BA641348b6761A6CC7a17",//Facory 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f
  token: '0x1b1F0c3Eba00fA6071638ec45C2a497EB31CB26D'
}

//Necessary Interfaces
const mnemonic = required_Items.mnemonic;
const provider = new ethers.providers.WebSocketProvider(required_Items.wss_TBSC)
const wallet = ethers.Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/1`);
const account = wallet.connect(provider)

// const hdNode = ethers.utils.HDNode.fromMnemonic(mnemonic);
// const acc2 = hdNode.derivePath(`m/44'/60'/0'/0/1`); // This returns a new HDNode
// const acc3 = hdNode.derivePath(`m/44'/60'/0'/0/2`);

console.log(account.address)
const R_router = new ethers.Contract( //R_router Contract Instance
        addresses.R_router,
        required_Items.routerABI,
        account
        ); 
const erc = new ethers.Contract(
    addresses.token,
    required_Items.ERC20,
    account
)
const weth = new ethers.Contract(
  addresses.WETH,
  required_Items.ERC20,
  account
)

var init = async function () {

const getAmountOut = await R_router.getAmountsOut(ethers.utils.parseUnits('10') ,[addresses.token, addresses.WETH])
const amountOutMin = getAmountOut[1].mul(80).div(100)

console.log(getAmountOut[1].toString(), amountOutMin.toString())
console.log(ethers.utils.parseUnits('10', 'gwei'), ethers.utils.parseUnits('10', 'gwei').toString())
    console.time("VictimBuy")
    const Buy = await R_router.swapExactTokensForTokens(
        ethers.utils.parseUnits('0.001'),
        amountOutMin,
        [addresses.WETH, addresses.token],
        account.address,
        Date.now() + 1000 * 60 * 5,
        {
            gasPrice: ethers.utils.parseUnits("5", 9),
            gasLimit: 1000000
          }
    )
        console.timeEnd("VictimBuy")
        console.log(`https://testnet.bscscan.com/tx/${Buy.hash}`)
};
  
  init();