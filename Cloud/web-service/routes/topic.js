var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');
var auth = require('../lib/auth');
var lowdb = require('../lib/db');
var shortid = require('shortid');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('/Users/thkim/Development/Blockchain/Dapp_blackbox/Cloud/evidence.db');
var loadImage = require('../lib/loadImage')
console.log(db)
var Web3 = require("web3");
var MyConstant = require("../../../Constant/constant")
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

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
  var addr=[]
  console.log('\nSearch Start!')
  db.all('SELECT * FROM contract WHERE time=? and location=?', [time,location], (err, row)=>{
    console.log(row)
    var body=''
    
      for(var i = 0;i<row.length;i++){
        addr[i] = row[i].contractAddress
        body+=loadImage(`/frame/${addr[i]}__frame1.jpg`, `/frame/${addr[i]}__frame2.jpg`,i, addr[i])
        console.log(`${i}th evidence contract addr: ${addr[i]}`)
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
  var contractAddr = post.contractAddr;
  console.log(`\n${count} : ${contractAddr}`)

  var html = template.HTML('search',
        `
        <p>${count} : ${contractAddr} request </p>
        `,
        `
        <p><a href="/topic/requester">requester</a><p>
        `,
        auth.statusUI(request, response)
      );

      //request contract
      var addr = request.user.address
      web3.eth.getTransactionCount(addr, (err, txCount)=>{
        
        const data = MyConstant.RequestData
        const txObject = {
            from : addr,
            nonce : web3.utils.toHex(txCount),
            gasLimit : web3.utils.toHex(1000000),
            gasPrice : web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
            data : data
        }

        web3.eth.sendTransaction(txObject, (err, txHash)=>{
            console.log("deploy contract hash: ", txHash)   
            var txh = txHash
            web3.eth.getTransactionReceipt(txh).then((receipt)=>{
                console.log('receipt : ', receipt)
                const requestContract = new web3.eth.Contract(MyConstant.RequestABI, receipt.contractAddress)
                requestContract.methods.requestVideo(MyConstant.ResponseAddress, contractAddr, 1).send({
                    from : addr,
                    gas:1000000
                }, (err, result)=>{
                    console.log("requestVideo txHash: ", result)
                })
                
                return
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


  response.send(html);
});



// router.get('/update/:pageId', function (request, response) {
//   if (!auth.isOwner(request, response)) {
//     response.redirect('/');
//     return false;
//   }
//   var topic = lowdb.get('topics').find({id:request.params.pageId}).value();
  
//   if(topic.user_id !== request.user.id){
//     request.flash('error', 'Not yours!');
//     return response.redirect('/');
//   } 
//   var title = topic.title;
//   var description = topic.description;
//   var list = template.list(request.list);
//   var html = template.HTML(title, list,
//     `
//         <form action="/topic/update_process" method="post">
//           <input type="hidden" name="id" value="${topic.id}">
//           <p><input type="text" name="title" placeholder="title" value="${title}"></p>
//           <p>
//             <textarea name="description" placeholder="description">${description}</textarea>
//           </p>
//           <p>
//             <input type="submit">
//           </p>
//         </form>
//         `,
//     `<a href="/topic/create">create</a> <a href="/topic/update/${topic.id}">update</a>`,
//     auth.statusUI(request, response)
//   );
//   response.send(html);
// });

// router.post('/update_process', function (request, response) {
//   if (!auth.isOwner(request, response)) {
//     response.redirect('/');
//     return false;
//   }
//   var post = request.body;
//   var id = post.id;
//   var title = post.title;
//   var description = post.description;
//   var topic = db.get('topics').find({id:id}).value();
//   if(topic.user_id !== request.user.id){
//     request.flash('error', 'Not yours!');
//     return response.redirect('/');
//   } 
//   db.get('topics').find({id:id}).assign({
//     title:title, description:description
//   }).write();
//   response.redirect(`/topic/${topic.id}`);
// });

// router.post('/delete_process', function (request, response) {
//   if (!auth.isOwner(request, response)) {
//     response.redirect('/');
//     return false;
//   }
//   var post = request.body;
//   var id = post.id;
//   var topic = lowdb.get('topics').find({id:id}).value();
//   if(topic.user_id !== request.user.id){
//     request.flash('error', 'Not yours!');
//     return response.redirect('/');
//   }
//   lowdb.get('topics').remove({id:id}).write();
//   response.redirect('/');
// });

// router.get('/:pageId', function (request, response, next) {
//   var topic = lowdb.get('topics').find({
//     id: request.params.pageId
//   }).value();
//   var user = lowdb.get('users').find({
//     id: topic.user_id
//   }).value();
//   var sanitizedTitle = sanitizeHtml(topic.title);
//   var sanitizedDescription = sanitizeHtml(topic.description, {
//     allowedTags: ['h1']
//   });
//   var list = template.list(request.list);
//   var html = template.HTML(sanitizedTitle, list,
//     `
//     <h2>${sanitizedTitle}</h2>
//     ${sanitizedDescription}
//     <p>by ${user.displayName}</p>
//     `,
//     ` <a href="/topic/create">create</a>
//             <a href="/topic/update/${topic.id}">update</a>
//             <form action="/topic/delete_process" method="post">
//               <input type="hidden" name="id" value="${topic.id}">
//               <input type="submit" value="delete">
//             </form>`,
//     auth.statusUI(request, response)
//   );
//   response.send(html);
// });
module.exports = router;