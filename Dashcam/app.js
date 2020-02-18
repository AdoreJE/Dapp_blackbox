var Tx = require('ethereumjs-tx')
var Web3 = require("web3");
var  MyConstant= require('../Constant/constant.js')
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

const dashcamAddress = MyConstant.dashcamAddress4
const dashPrivateKey = MyConstant.dashcamPrivateKey4

const EvidenceABI = MyConstant.EvidenceABI

const SearchAddress = MyConstant.SearchAddress


// 1. Deploy Evidence Contract
web3.eth.getTransactionCount(dashcamAddress, (err, txCount)=>{
    const data = '0x608060405234801561001057600080fd5b50610228806100206000396000f3fe60806040526004361061003b576000357c010000000000000000000000000000000000000000000000000000000090048063ef57581914610040575b600080fd5b6100c0600480360360a081101561005657600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019092919080359060200190929190803590602001909291905050506100c2565b005b836000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508260018190555081600281905550806003819055506000600460006101000a81548160ff0219169083151502179055508473ffffffffffffffffffffffffffffffffffffffff16639f2c39b43084846040518463ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018381526020018281526020019350505050600060405180830381600087803b1580156101dd57600080fd5b505af11580156101f1573d6000803e3d6000fd5b50505050505050505056fea165627a7a7230582095d8cb07a7baab61bbd68f80e1d496da9d8a7b121883533451afa2fd888a7e5f0029'
    const txObject = {
        from : dashcamAddress,
        nonce : web3.utils.toHex(txCount),
        gasLimit: web3.utils.toHex(1000000),
        gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
        data : data
    }
    //Sign the transaction
    const tx = new Tx(txObject)
    tx.sign(dashPrivateKey)

    const serializedTx = tx.serialize()
    const raw = '0x' + serializedTx.toString('hex')

    //Boradcast the transaction
    web3.eth.sendSignedTransaction(raw, (err, txHash)=>{
        //console.log('err: ', err, 'txHash: ', txHash)
        //Use this txHash to find the contract on Etherscan!
    }).on('receipt',(receipt)=>{
        console.log(receipt.contractAddress)
        const EvidenceContract = new web3.eth.Contract(EvidenceABI, receipt.contractAddress)
        EvidenceContract.methods.setEvidence(SearchAddress, dashcamAddress, 4, 4, 4).send({
            from : dashcamAddress,
            gasLimit: web3.utils.toHex(1000000)
        },(err, result)=>{
            console.log(result)
        })
    })
})



    
