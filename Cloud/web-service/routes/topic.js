var express = require('express');
const fileUpload = require('express-fileupload');
var router = express.Router();
var path = require('path');
var template = require('../lib/template.js');
var auth = require('../lib/auth');
var lowdb = require('../lib/db');
var shortid = require('shortid');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('C:/Dapp_blackbox/Cloud/evidence.db');
// var db = new sqlite3.Database('/Users/thkim/Development/Blockchain/Dapp_blackbox/Cloud/evidence.db');
var loadImage = require('../lib/loadImage')
var loadRequestInfo = require('../lib/loadRequestInfo')
var loadRequestDetail = require('../lib/loadRequestDetail')
console.log(db)
var Web3 = require("web3");
var MyConstant = require("../../../Constant/constant")
web3 = new Web3(new Web3.providers.WebsocketProvider("ws://155.230.16.117:7545"))

var exec = require('child_process').exec,
    child;

router.get('/search', function (request, response) {
	if (!auth.isOwner(request, response)) {
		response.redirect('/');
		return false;
  	}
	var title = 'WEB - search';
	var html = template.HTML(title,`
     	<form action="/topic/search_process" method="post">
			<p><input type="text" name="time" placeholder="time"></p>
			<p><input type="text" name="location" placeholder="location"></p>
			<p>
				<input type="submit">
			</p>
      	</form>
    	`, `
   		<p><a href="/topic/search">search</a></p>
		<p><a href="/topic/owner">owner</a></p>
		<p><a href="/topic/requester">requester</a><p>
   	 	`
    	, auth.statusUI(request, response));
  	response.send(html);
});

router.post('/search_process', function (request, response) {
 	if (!auth.isOwner(request, response)) {
		response.redirect('/');
		return false;
  	}
	var post = request.body;
	var time = post.time;
	var location = post.location;
	var id = shortid.generate();
	var evidenceContractAddress=[]
	console.log('\nSearch Start!')
	db.all('SELECT * FROM contract WHERE time=? and location=?', [time,location], (err, row)=>{
		console.log(row)
		var body=''
    
		for(var i = 0;i<row.length;i++){
			evidenceContractAddress[i] = row[i].evidenceContractAddress
			body+=loadImage(`/frame/${evidenceContractAddress[i]}_frame1.jpg`, 
							`/frame/${evidenceContractAddress[i]}_frame2.jpg`,
							i, evidenceContractAddress[i])
			console.log(`${i}th evidence contract addr: ${evidenceContractAddress[i]}`)
		}   
      	var html = template.HTML('search',
								`
								${body}
								`,
								`<p><a href="/topic/search">search</a></p>
								<p><a href="/topic/owner">owner</a></p>
								<p><a href="/topic/requester">requester</a><p>`,
      							auth.statusUI(request, response)
    							);
    	response.send(html);
  	})
});

//블록체인 수행 부분
router.post('/search_request', function (request, response) {
	if (!auth.isOwner(request, response)) {
		response.redirect('/');
		return false;
	}
	var post = request.body;
	var count = post.count;
	var evidenceContractAddress = post.evidenceContractAddress;
	console.log(`\n${count} : ${evidenceContractAddress}`)

  	var html = template.HTML('search',
							`
								<p>${count} : ${evidenceContractAddress} request </p>
							`,
							`
								<p><a href="/topic/requester">requester</a><p>
							`,
							auth.statusUI(request, response)
						);
	//request requester's public key
	child = exec(`python3 ../keyRequestServer.py --request 'puKey' --email '${request.user.email}' --password '${request.user.password}'`, function (error, stdout, stderr) {
		var output = stdout.split('\n')
		var correctness = output[1]
		if(correctness !== 'correct'){
			console.log('error')
			response.redirect('/topic/search_process')
			return
		}
		var requesterPublicKey = output[2]
		console.log('requesterPublicKey: ', requesterPublicKey)
		console.log('stderr: ' + stderr);
		if (error !== null) {
			console.log('exec error: ' + error);
		}
	


      //request contract
	var requesterAccountAddress = request.user.address
	web3.eth.getTransactionCount(requesterAccountAddress, (err, txCount)=>{
        const data = MyConstant.RequestData
        const txObject = {
            from : requesterAccountAddress,
            nonce : web3.utils.toHex(txCount),
            gasLimit : web3.utils.toHex(1000000),
            gasPrice : web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
            data : data
        }

        web3.eth.sendTransaction(txObject, (err, txHash)=>{
            console.log("deploy contract hash: ", txHash)   
						var txh = txHash
						//request contract address를 따로 저장
            web3.eth.getTransactionReceipt(txh).then((receipt)=>{
                console.log('receipt : ', receipt)
                const requestContract = new web3.eth.Contract(MyConstant.RequestABI, receipt.contractAddress)
				requestContract.methods.requestVideo(MyConstant.ResponseAddress, evidenceContractAddress, requesterPublicKey).send(
					{
						from : requesterAccountAddress,
						gas:1000000
                	}, (err, result)=>{
                    		console.log("requestVideo txHash: ", result)
                		})
			})
            

            // setTimeout(function() {
            //   return web3.eth.getTransactionReceipt(txh).then((receipt)=>{
            //     console.log('receipt : ', receipt)
            //     const requestContract = new web3.eth.Contract(MyConstant.RequestABI, receipt.contractAddress)
            //     requestContract.methods.requestVideo(responseAddr, evidAddr, 1).send({
            //         from : Addr,
            //         gas:1000000
            //     }, (err, result)=>{
            //         console.log("requestVideo txHash: ", result)
            //     })
                
            //     return
            //   })
            // }, 3000);
            return
        })
		})
	})
  	response.send(html);
});

router.get('/owner', function (request, response) {
	if (!auth.isOwner(request, response)) {
		response.redirect('/');
		return false;
	}
	const responseContract = new web3.eth.Contract(MyConstant.ResponseABI, MyConstant.ResponseAddress)
	responseContract.methods.get().call({from:request.user.address}, (err, result)=>{
		awaitGetData(request,response,result)
	})
});

async function awaitGetData(request, response, result){
	console.log('awaitGetData run')
	var body = await requestGetData(request, result)
  // console.log('body: ', body) 
	var title = 'WEB - owner';
	var html = template.HTML(title,`
							${body}
							
  <script>
  function fetchPage(name){

	fetch(name).then(function(response){
		response.text().then(function(text){
			document.getElementById('aaa').innerHTML = text;
		})
	  });
	 // window.location.reload()
}




  </script>
							`, `
								<p><a href="/topic/search">search</a></p>
								<p><a href="/topic/owner">owner</a></p>
								<p><a href="/topic/requester">requester</a><p>
							`
							, auth.statusUI(request, response));
   	response.send(html); 
}

async function requestGetData(request, result, body){
	console.log('requestGetData run')
	var body=''
	for(var i = 0;i<result.length;i++){
		requestContractAddress = result[i]
		requestContract = new web3.eth.Contract(MyConstant.RequestABI, requestContractAddress)
    var data = await requestContract.methods.getData().call({from:request.user.address})
		var evidenceContractAddr = data['_evidAddr']
		var publicKey = data['_puk'].toString() //requester's puk
    	body=body + loadRequestDetail(`/frame/${evidenceContractAddr}_frame1.jpg`,
									`/frame/${evidenceContractAddr}_frame2.jpg`,
									requestContractAddress, publicKey, evidenceContractAddr)           
  	}
	console.log('requestGetData end')
	return body
}

async function getRekey(){
	
	
}

router.post('/owner_yes', (request, response)=>{
	if (!auth.isOwner(request, response)) {
		response.redirect('/');
		return false;
	}
    var body=''
    var post = request.body
    var requestContractAddress = post.requestContractAddress
		var publicKey = post.publicKey.substring(2,68)
		
		var evidenceContractAddress = post.evidenceContractAddress
    console.log('requestContractAddr: ', requestContractAddress)
		console.log('publickKey: ', publicKey)
		console.log('evidenceContractAddress: ', evidenceContractAddress)
		
		
    requestContract = new web3.eth.Contract(MyConstant.RequestABI, requestContractAddress)
	//python 실행 재암호화키와 link 받아오기
		child = exec(`python3 ../keyRequestServer.py --request "reKey" --email "${request.user.email}" --password "${request.user.password}" --publicKey ${publicKey} --evidenceContractAddress "${evidenceContractAddress}"`, function (error, stdout, stderr) {
			var output = stdout.split('\n')
			console.log(output)
			var correctness = output[1]
			var capsule = output[3]
			console.log(capsule)
			console.log('stderr: ' + stderr);
			if (error !== null) {
					console.log('exec error: ' + error);
			}
			if(correctness != 'correct'){
				console.log('error')
				response.redirect('/topic/owner')
				return
			}
		
		requestContract.methods.setData(capsule,correctness).send({from:request.user.address, gas:200000}, (err, txHash)=>{
      
			var title = 'WEB - owner';
			var html = template.HTML(title,`
				${txHash}
				<form ref='uploadForm' id='uploadForm' action='/topic/upload' method='post' encType="multipart/form-data">
					<input type="file" name="sampleFile" value="aaa.txt" />
					<input type='submit' value='Upload!' />
				</form> 
				`, `
					<p><a href="/topic/search">search</a></p>
					<p><a href="/topic/owner">owner</a></p>
					<p><a href="/topic/requester">requester</a><p>
				`
				, auth.statusUI(request, response));
			response.send(html); 
		  })  
	});
	


})

router.post('/upload', (req,res)=>{
	if(Object.keys(req.files).length == 0){
		return res.status(400).send('No files were uploaded.')
	}
  	let sampleFile = req.files.sampleFile

  	sampleFile.mv('/Users/thkim/Development/Blockchain/Dapp_blackbox/Cloud/uploadedfile', function(err) {
		if (err)
			return res.status(500).send(err);
		res.redirect('/topic/owner');
  	});
})

router.get('/requester', function (request, response) {
	if (!auth.isOwner(request, response)) {
		response.redirect('/');
		return false;
	}
	const requestContract = new web3.eth.Contract(MyConstant.RequestABI,
													'0x3c04C588fF0C1D8FCea8456453C933e8fCD35290')
	requestContract.methods.getReKey().call({from:request.user.address}, (err, result)=>{
		var rekey = result['_rekey']
		var link = result['_link']
		//console.log('body: ', body)   
		var title = 'WEB - owner';
		var html = template.HTML(title,`
									<p>rekey : ${rekey}</p>
									<p>link : ${link}</p>
								`, `
									<p><a href="/topic/search">search</a></p>
									<p><a href="/topic/owner">owner</a></p>
									<p><a href="/topic/requester">requester</a><p>
								`
     							, auth.statusUI(request, response));
   		response.send(html);
  	})
})

module.exports = router;