var Tx = require('ethereumjs-tx')
var Web3 = require('web3')
var MyConstant = require('../../Constant/constant.js')
web3 = new Web3(new Web3.providers.WebsocketProvider("ws://155.230.16.117:7545"))
var db = require('./lib/db');


//const cloudAddr = db.get('cloud').value()[0].cloudAddr
const cloudAddr = MyConstant.cloudAddr
console.log(cloudAddr)
web3.eth.getTransactionCount(cloudAddr, (err, txCount)=>{
    
    const data = MyConstant.SearchData
    const txObject = {
        from : cloudAddr,
        nonce : web3.utils.toHex(txCount),
        gasLimit : web3.utils.toHex(1000000),
        gasPrice : web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
        data : data
    }

    //sign
    // const tx = new Tx(txObject)
    // tx.sign(cloudPrivateKey)

    // const serializedTx = tx.serialize()
    // const raw = '0x' + serializedTx.toString('hex')

    // web3.eth.sendSignedTransaction(raw, (err, a)=>{
    //     console.log(a)
    // })

    // web3.eth.sendTransaction(txObject, (err, txHash)=>{
    //     console.log(txHash)   
    //     web3.eth.getTransactionReceipt(txHash, (err, receipt)=>{
    //         console.log(receipt)
    //     })
    // })



    web3.eth.sendTransaction(txObject, (err, txHash)=>{
        console.log("deployed contract Tx hash: ", txHash)   
        var txh = txHash
        var contractAddr=''
        web3.eth.getTransactionReceipt(txh,(err, receipt)=>{
          console.log('receipt: ', receipt)
          process.exit()
        })
        // setTimeout(function() {
        //   return web3.eth.getTransactionReceipt(txh).then((receipt)=>{
            
        //     contractAddr = receipt.contractAddress
        //     console.log('receipt : ', contractAddr)
        //     return
        //   })
        // }, 5000);
        // return
    })
  
  

})



// console.log(hash)
    // web3.eth.getTransactionReceipt(hash,(err, receipt)=>{
    //     console.log(err, receipt)
    // })
// // web3.eth.getTransactionReceipt("0x52bc1fe83517d098193e3e998203e8eb8ec007320119af28b048547e6b259521", (err, result)=>{
// //                 console.log(err, result)
// //             })
