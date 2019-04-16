
var Web3 = require("web3");

// const ws = new WebSocket('ws://155.230.16.117:13000');
// web3 = new Web3(new Web3.providers.HttpProvider("http://155.230.16.117:7545"))
web3 = new Web3(new Web3.providers.WebsocketProvider("ws://155.230.16.117:7545"))

web3.eth.getAccounts((err, result)=>{
    console.log(err, result)
})