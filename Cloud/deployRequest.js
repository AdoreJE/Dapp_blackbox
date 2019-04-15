var Web3 = require('web3')
var MyConstant = require('../Constant/constant.js')
web3 = new Web3(new Web3.providers.WebsocketProvider("ws://155.230.16.117:7545"))

const Addr = MyConstant.requesterAddr1
//const evidAddr = '0x8Dce97144823fC2a914356C7ef262B08E0858c50'
const responseAddr = MyConstant.ResponseAddress

const num = process.argv[2]
const evidAddr = process.argv[3]


const responseContract = new web3.eth.Contract(MyConstant.ResponseABI, MyConstant.ResponseAddress)
if(num == 0){
    web3.eth.getTransactionCount(Addr, (err, txCount)=>{
        
        const data = MyConstant.RequestData
        const txObject = {
            from : Addr,
            nonce : web3.utils.toHex(txCount),
            gasLimit : web3.utils.toHex(1000000),
            gasPrice : web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
            data : data
        }

        web3.eth.sendTransaction(txObject, (err, txHash)=>{
            console.log("deploy contract hash: ", txHash)   
            web3.eth.getTransactionReceipt(txHash, (err, receipt)=>{
                console.log("contractAddress: ",receipt.contractAddress)
                const requestContract = new web3.eth.Contract(MyConstant.RequestABI, receipt.contractAddress)
                requestContract.methods.requestVideo(responseAddr, evidAddr, 1).send({
                    from : Addr,
                    gas:1000000
                }, (err, result)=>{
                    console.log("requestVideo txHash: ", result)
                })
            })
        })
    })
}
else if(num ==1){
    requestContract.methods.requestVideo(responseAddr, evidAddr, 1).send({
        from : Addr,
        gas:1000000
    }, (err, result)=>{
        console.log("txHash: ", result)
    })
}