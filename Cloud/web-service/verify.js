var Tx = require('ethereumjs-tx')
var Web3 = require('web3')
var MyConstant = require('../../Constant/constant.js')
web3 = new Web3(new Web3.providers.WebsocketProvider("ws://155.230.16.117:7545"))

const cloudAddr = MyConstant.cloudAddr

const SearchAddr = MyConstant.SearchAddress
const num = process.argv[2]

const evidenceAddr = process.argv[3]
const evidenceABI = MyConstant.EvidenceABI

const evidenceContract = new web3.eth.Contract(evidenceABI, evidenceAddr)

if(num == 0){
    evidenceContract.methods.getData().call().then((result)=>{
        console.log(result)
    })
}
else if (num == 1){
    evidenceContract.methods.verify(SearchAddr).send({
        from : cloudAddr,
        gas:1000000
    }, (err, result)=>{
        console.log(err, result)
        process.exit()
    })
}