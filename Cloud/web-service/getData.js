
var Web3 = require('web3')
var sqlite3 = require('sqlite3').verbose();
var MyConstant = require('../../Constant/constant.js')
web3 = new Web3(new Web3.providers.WebsocketProvider("ws://155.230.16.117:7545"))

var db = new sqlite3.Database('/Users/thkim/Development/Blockchain/Dapp_blackbox/Cloud/evidence.db');


const SearchContract = new web3.eth.Contract(MyConstant.SearchABI, MyConstant.SearchAddress)
//1초마다 반복실행
! function getAddress(){
    SearchContract.methods.getAddress().call().then((result)=>{
        console.log(result)
        
        for(var i = 0;i<result.length;i++){
            var evidenceContractAddress = result[i]
            //Evidence address
            getData(evidenceContractAddress)
        }
    })

    setTimeout(function(){
        getAddress()
    },1000)
}()

function getData(evidenceContractAddress){
    console.log(evidenceContractAddress)
    SearchContract.methods.getData(evidenceContractAddress).call().then((data)=>{
        //console.log(data)
        var stmt = db.prepare("INSERT OR IGNORE INTO contract VALUES (?,?,?)")
        var time = data[0].toString()
        var location = data[1].toString()
        
    
        stmt.run(evidenceContractAddress, time, location)
        stmt.finalize()
    })
}

//db 추가로 생성