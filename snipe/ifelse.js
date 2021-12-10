if (Data.name === 'addLiquidity'){//✅ Checked
            console.log("TransactionHash",transaction.hash)
            console.log("Decoded:", Data, `
            Func:`, Data.name, `
            Token0:`, token0 = Data.params[0].value,`
            Token1`, toeken1 = Data.params[1].value,`
            GasPrice:`, Gas = transaction.gasPrice.toString()-1, transaction.gasPrice.toString()); 
          }
          else if (Data.name === 'swapTokensForExactTokens' || Data.name === 'swapExactTokenForTokens'){//✅
            console.log("TransactionHash",transaction.hash)
            console.log("Decoded:", Data, `
            Func:`, Data.name, `
            Token0:`, token0 = Data.params[2].value[0],`
            Token1`, toeken1 = Data.params[2].value[1],`
            GasPrice:`, Gas = transaction.gasPrice.toString()-1, transaction.gasPrice.toString()); 
          }
          else if (Data.name === 'swapETHForExactTokens' || Data.name === 'swapExactETHForTokens' //✅ For ETH First
         ){
            console.log("TransactionHash",transaction.hash)
            console.log("Decoded:", Data, `
            Func:`, Data.name, `
            Token0:`, token0 = Data.params[1].value[0],`
            Token1`, toeken1 = Data.params[1].value[1],`
            GasPrice:`, Gas = transaction.gasPrice.toString()-1, transaction.gasPrice.toString()); 
          } 
          else if (Data.name === 'swapExactTokensForETH' ||Data.name === 'swapTokensForExactETH'){
            console.log("TransactionHash",transaction.hash)
            console.log("Decoded:", Data, `
            Func:`, Data.name, `
            Token0:`, token0 = Data.params[2].value[0],`
            Token1`, toeken1 = Data.params[2].value[1],`
            GasPrice:`, Gas = transaction.gasPrice.toString()-1, transaction.gasPrice.toString());
          }
          else {
            console.log("RETURN")
            return;
          }