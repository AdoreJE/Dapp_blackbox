var Web3 = require('web3')
var MyConstant = require('../../Constant/constant.js')
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"))
var db = require('./lib/db.js');


//const cloudAddr = db.get('cloud').value()[0].cloudAddr
const cloudAddr = MyConstant.cloudAddr
web3.eth.getTransactionCount(cloudAddr, (err, txCount)=>{
    
    const data = MyConstant.ResponseData
    const txObject = {
        from : cloudAddr,
        nonce : web3.utils.toHex(txCount),
        gasLimit : web3.utils.toHex(1000000),
        gasPrice : web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
        data : data
    }

    web3.eth.sendTransaction(txObject, (err, txHash)=>{
        console.log("deployed contract Tx hash: ", txHash)   
        var txh = txHash
        var contractAddr=''
        web3.eth.getTransactionReceipt(txh, (err, receipt)=>{
          console.log(receipt)

        })
        // setTimeout(function() {
        //   return web3.eth.getTransactionReceipt(txh).then((receipt)=>{
            
        //     contractAddr = receipt.contractAddress
        //     console.log('receipt : ', contractAddr)
        //     return
        //   })
        // }, 3000);
        // return
    })
})

