var ethers = require("ethers");
const required_Items = require('../snipe/cfg.json');
// const sandwich = require('./sandWich.js')

const mnemonic = required_Items.mnemonic;
const provider = new ethers.providers.WebSocketProvider(required_Items.wss_TBSC)
const wallet = ethers.Wallet.fromMnemonic(mnemonic);
const account = wallet.connect(provider);

// let Reserve 
// export var Reserve
pair_Address = "0xE1A1A379f9aDE4190BDddDEE6A9D4D734FcfaaDB"; // ETH 0xCADBf933Ca5738490816b4807f039d3C3059d1CC
const Pair = new ethers.Contract(
    pair_Address,
    required_Items.PairAbi,
    provider
)
const router = new ethers.Contract(
    "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    required_Items.routerABI,
    provider
)

async function update(Reserve) {
    provider.on('block', async () => {
    Reserve = await Pair.getReserves();
    amountIn = ethers.utils.parseUnits("1000", "ether");
    factor = ethers.utils.parseUnits("997","ether")
    // AmountOuts = await router.getAmountsOut(amountIn ,
    // ["0x83D19769e2781cBeBfCa59D807a8a314afa24285", "0x3c357100488093D74A857C0801D8731e8fBe1eDE"])

    R0= ethers.utils.formatEther(Reserve[0]), R1= ethers.utils.formatEther(Reserve[1])
    wbnb_out = (Reserve[0].mul(factor)).div((Reserve[1].add(factor)))
    slip_check = wbnb_out.mul(95).div(100)

    console.log(
    `Reserve0`,R0,`\nReserve1`, R1,`\nTokenOut`, ethers.utils.formatEther(wbnb_out),`\nslipCheck`, ethers.utils.formatEther(slip_check),`
    `)
    })


}
update();