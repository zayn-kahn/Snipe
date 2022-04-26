const ethers = require("ethers");
const abiDecoder = require('abi-decoder');
const required_Items = require('../snipe/cfg.json');

const addresses = {// Necessary Address
    WETH: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",//WETH 0xc778417E063141139Fce010982780140Aa0cD5Ab
    R_router: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1",//Router 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
    factory: "0x6725F303b657a9451d8BA641348b6761A6CC7a17",//Facory 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f
    Swap: '0xe9a51eBA117ae960611e040B4b0C7F095F945c35'
  }
const mnemonic = required_Items.mnemonic;
const provider = new ethers.providers.WebSocketProvider(required_Items.wss_TBSC)
const wallet = ethers.Wallet.fromMnemonic(mnemonic);
const account = wallet.connect(provider);

var init = function () {
    filter = {
        address: "0x3173E63d2Abbc1582fE41719EDeEE25A2624aC9D",
        topics: [
            ethers.utils.id("swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline)")
        ]
    }

    provider.on("filter", async (tx) => {
        let transaction = await provider.getTransaction(tx)

    })

}

init();
