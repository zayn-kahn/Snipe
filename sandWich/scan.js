var ethers = require("ethers");
const abiDecoder = require('abi-decoder');
const required_Items = require('../snipe/cfg.json');

var Reserve = [0, 0, 0];
var factor = ethers.utils.parseUnits("997000000", 9); 


const addresses = {// Necessary Address
    WETH: "0x1b1F0c3Eba00fA6071638ec45C2a497EB31CB26D", //WBNB 0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",//WETH 0xc778417E063141139Fce010982780140Aa0cD5Ab
    R_router: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1",//Router 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
    factory: "0x6725F303b657a9451d8BA641348b6761A6CC7a17",//Facory 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f
    Swap: '0xe9a51eBA117ae960611e040B4b0C7F095F945c35'
  }
const mnemonic = required_Items.mnemonic;
const provider = new ethers.providers.WebSocketProvider(required_Items.wss_TBSC)
const wallet = ethers.Wallet.fromMnemonic(mnemonic);
const account = wallet.connect(provider);

    const R = new ethers.Contract(
        addresses.R_router,
        required_Items.routerABI,
        account
    )
    pair_Address = "0xE1A1A379f9aDE4190BDddDEE6A9D4D734FcfaaDB"; // ETH 0xCADBf933Ca5738490816b4807f039d3C3059d1CC
const Pair = new ethers.Contract(
    pair_Address,
    required_Items.PairAbi,
    provider
)

abiDecoder.addABI(required_Items.routerABI)

var mempool = function () {

    provider.on("pending", async (tx) => {
        let transaction = await provider.getTransaction(tx)
        if (!transaction || transaction.from === account.address){
            return;
        }else {
            Data = abiDecoder.decodeMethod(transaction.data);
            if (!Data) {
                return;
            } else if (Data.name === 'swapExactTokensForTokens' || Data.params[2].value[0] === "0x1b1F0c3Eba00fA6071638ec45C2a497EB31CB26D"){
                const [amountIn ,amountOutMin , path, to, deadline] = Data.params.map((x) => x.value);
                console.log(amountIn, amountOutMin, ethers.utils.getAddress(path[0]), ethers.utils.getAddress(path[1])
                , to, deadline, path)
                const aInWithFee = ethers.BigNumber.from(amountIn).mul(997);
                const numerator = aInWithFee.mul(Reserve[1]);
                const denominator = aInWithFee.add(Reserve[0].mul(1000));
                const out = numerator.div(denominator);
                const perc = (ethers.BigNumber.from("100")).div(95)
                const check = out.div(perc)
                if (check > ethers.BigNumber.from(amountOutMin)) {
                sandWichIn = R.swapExactTokensForTokens(
                    amountIn,
                    amountOutMin,
                    path,
                    account.address,
                    deadline,
                        {
                            gasPrice: 3*transaction.gasPrice,
                            gasLimit: 1000000
                        }
                )
                Receipent = await sandWichIn.wait();
                console.log(`https://testnet.bscscan.com/tx/${Receipent.hash}`)

                const erc = new ethers.Contract(
                    ethers.utils.getAddress(path[1]),
                    required_Items.ERC20,
                    account
                )
                approve = await erc.approve(ethers.BigNumber.from(amountOutMin).mul(2), addresses.R_router)
                Receipent = await approve.wait();

                sandWichOut = R.swapExactTokensForTokens(
                    amountOutMin,
                    amountIn,
                    [ethers.utils.getAddress(path[1]), ethers.utils.getAddress(path[0])],
                    account.address,
                    deadline,
                        {
                            gasPrice: 5*transaction.gasPrice,
                            gasLimit: 1000000
                        }
                )
                console.log(`https://testnet.bscscan.com/tx/${sandWichOut.hash}`)

            }
        
            }
        }

    })
  }
  
mempool();

var updateReserve = function() {
    provider.on('block', async () => {
        Reserve = await Pair.getReserves();
     })
}

updateReserve();