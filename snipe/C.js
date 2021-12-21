var ethers = require("ethers");
const abiDecoder = require('./abi-decoder');
const required_Items = require('./cfg.json');

const mnemonic = required_Items.mnemonic;
const provider = new ethers.providers.WebSocketProvider(required_Items.wss_Ropsten)
const wallet = ethers.Wallet.fromMnemonic(mnemonic);
const account = wallet.connect(provider)

const Swap = new ethers.Contract("",
    required_Items.ABI,
    account);

const amountIn = ethers.utils.parseUnits('0.001', 'ether');
async function main() {

    const Buy = await Swap.x2069(
    )
    const Sell = await Swap.x2069(
    )
 console.log(`https://ropsten.etherscan.io/tx${Buy.hash}`)
 console.log(`https://ropsten.etherscan.io/tx${Sell.hash}`)
    
   }
   
   main()
     .then(() => process.exit(0))
     .catch(error => {
       console.error(error);
       process.exit(1);
     });