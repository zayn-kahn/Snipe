const ethers = require('ethers');
const required_Items = require('./cfg.json');

const addresses = {
    WETH: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
    R_router: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    factory: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
    me: "0x328f9A19627FC376c95A852622798F5Ce2f43367"
}

const mnemonic = required_Items.mnemonic;

const provider = new ethers.providers.WebSocketProvider(required_Items.wss_RETH)
const wallet = ethers.Wallet.fromMnemonic(mnemonic);
const account = wallet.connect(provider)
// console.log("Accounts check",account, addresses.me)
const factory = new ethers.Contract( //Factory Contract Instance
    addresses.factory,
    required_Items.FactoryABI,
    account
);
const R_router = new ethers.Contract( //R_router Contract Instance
    addresses.R_router,
    required_Items.R_routerABI,
    account
);

const erc20 = new ethers.Contract(
    addresses.WETH,
    required_Items.ERC20,
    account
)
// const amountIn = ethers.utils.parseUnits('0.0001', 'ether');
// const Mul = ethers.utils.parseUnits("90", 'ether').toString(); const Div = ethers.utils.parseUnits("100", 'ether').toString(); 
// console.log(Mul, Div)
// const amountsOut = ethers.utils.parseUnits("100000000000000000000").toString();
// const amountOutMin = (amountsOut[1]*Mul)/Div; // math for Big numbers in JS
// console.log(amountIn, amountOutMin)
factory.on("PairCreated", async (token0, token1, addressPair) => { //Pair Creation Event
    console.log(`
    ~~~~~~~~~~~~~~~~~~
    New pair detected
    ~~~~~~~~~~~~~~~~~~
    token0: ${token0}
    token1: ${token1}
    addressPair: ${addressPair}
    `);

    // This block ensures we pay with WETH
    let InputToken, outputToken;
    if(token0 === addresses.WETH) {
        InputToken = token0;
        outputToken = token1;
        console.log("Position 1:",token0, token1)
    }
    if (token1 === addresses.WETH) {
        InputToken = token1;
        outputToken = token0;
        console.log("Position 2:",token1, token0)
    }
    // Neither token is WETH and we cannot purchase
    if(typeof InputToken === "undefined") {
        console.log("No WETH Pair Detected")
        return
    }
    const amountIn = ethers.utils.parseUnits('0.01', 'ether'); //ether is the measurement, not the coin
    const amountsOut = await R_router.getAmountsOut(amountIn, [InputToken, outputToken]);

    const amountOutMin = amountsOut[1]
        .mul(ethers.utils.parseUnits("20", 'ether'))
        .div(ethers.utils.parseUnits("100", 'ether')); // math for Big numbers in JS
    console.log(amountIn.toString(), amountOutMin.toString())
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
        gasPrice: ethers.utils.parseUnits('200', 'gwei'),
        gasLimit: 250000
        }
    );
    const receipt = await tx.wait();
    console.log('https://rinkeby.etherscan.io', tx.hash);
    }
)
