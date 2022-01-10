var ethers = require("ethers");
const abiDecoder = require('abi-decoder');
const required_Items = require('../snipe/cfg.json');
// const r = require('./reservesU')



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
    const Swap = new ethers.Contract(
        addresses.Swap,
        required_Items.contract,
        account
    )
    const R = new ethers.Contract(
        addresses.R_router,
        required_Items.routerABI,
        account
    )
    abiDecoder.addABI(required_Items.routerABI)

var init = function () {

    provider.on("pending", async (tx) => {
        let transaction = await provider.getTransaction(tx)
        if (!transaction){ // 1
            return;
        }else{             //1`
            Data = await abiDecoder.decodeMethod(transaction.data);
            if (!Data){   //2
                return;
            } else if (Data.name === 'swapExactTokensForTokens') {       //2`
                token0 = ethers.utils.getAddress(Data.params[2].value[0]);
                Amount0 = Data.params[0].value;
                token1 = ethers.utils.getAddress(Data.params[2].value[1]);
                Amount1 = Data.params[1].value;
                
                if(token0 === addresses.WETH) { // 3
                    InputToken = token1;
                    outputToken = token0;
                    path = [InputToken, outputToken]
                    console.log("WBNB IN")
                }
                else if (token1 === addresses.WETH) { //3`
                    InputToken = token0;
                    outputToken = token1;
                    path = [InputToken, outputToken]
                    console.log("WBNB OUT")
                }
                // Neither token is WETH and we cannot purchase
                else {  //3`
                    console.log("No WETH Pair Detected")
                    return;
                }

                console.time("sandwichStart")
            const slippage_Check = await R.getAmountsOut(Amount0 ,Data.params[2].value)
                console.log(slippage_Check)
            var condition = slippage_Check[1].mul(80).div(100)
            // return
            if (condition <= slippage_Check[1]){
                const Buy = await R.swapExactTokensForTokens(
                    Amount0.mul(100).div(60),
                    condition.mul(100).div(90),
                    path = [InputToken, outputToken],
                    account.address,
                    Date.now() + 1000 * 60 * 5,
                    {
                        gasPrice: 3*transaction.gasPrice,
                        gasLimit: 1000000
                    }
                )
            console.log(`https://testnet.bscscan.com/tx/${Buy.hash}`)

            erc = new ethers.Contract(
                Data.params[2].value[1],
                required_Items.ERC20,
                account
            )
            const approve = await erc.approve(addresses.R_router, condition) 
            const Sell = await R.swapExactTokensForTokens(
                condition.mul(100).div(90),
                0,
                [outputToken, InputToken],
                account.address,
                Date.now() + 1000 * 60 * 5,
                {
                    gasPrice: 3*transaction.gasPrice,
                    gasLimit: 1000000
                }
            )
            console.log(`https://testnet.bscscan.com/tx/${Sell.hash}`)
            }

            
            // const Buy = await Swap.P2W(
                //     true,
                //     addresses.R_router,
                //     InputToken,
                //     outputToken,
                //     ethers.utils.parseUnits('0.001', 'ether'),
                //     0,
                //     addresses.Swap,
                //     {
                //         gasPrice: transaction.gasPrice - 1,
                //         gasLimit: 2500000
                //       }
                // )
            //  console.log(transaction.maxPriorityFeePerGas, )
            }
        }
    })
  }
  
  init();

