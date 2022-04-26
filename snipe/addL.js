var ethers = require("ethers");
const abiDecoder = require('./abi-decoder');
const required_Items = require('./cfg.json');
// const print = require('./ifelse')

const addresses = {// Necessary Address
  WETH: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",//WETH 0xc778417E063141139Fce010982780140Aa0cD5Ab
  R_router: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1",//Router 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
  factory: "0x6725F303b657a9451d8BA641348b6761A6CC7a17",//Facory 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f
  token: '0xE7C6D08F02c264a96bB02313AC374F55C9A40E1d'
}

//Necessary Interfaces
const mnemonic = required_Items.mnemonic;
const provider = new ethers.providers.WebSocketProvider(required_Items.wss_TBSC)

const hdNode = ethers.utils.HDNode.fromMnemonic(mnemonic);

const acc2 = hdNode.derivePath(`m/44'/60'/0'/0/1`); // This returns a new HDNode
const acc3 = hdNode.derivePath(`m/44'/60'/0'/0/2`);

const wallet = ethers.Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/1`);
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
const erc = new ethers.Contract(
    addresses.WETH,
    required_Items.ERC20,
    account
)


var init = async function () {
    
    console.time("AddL")
    addLiquidity = await R_router.addLiquidity(
        addresses.WETH,
        addresses.token,
        ethers.utils.parseUnits('0.01', 'ether'),//Liquidity WBNB
        ethers.utils.parseUnits('1000', 'ether'),// Liquidity other token
        0,// Minimum WBNB
        0,// Minimum Other tokeen
        addresses.token, // to Address
        Date.now() + 1000 * 60 * 5,
        {
          gasPrice: ethers.utils.parseUnits('5', 'gwei'),
          gasLimit: 2500000
        }
    )
        console.timeEnd("AddL")
        console.log(`https://testnet.bscscan.com/tx/${addLiquidity.hash}`)
};
  
  init();