var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');
var shortid = require('shortid');
var db = require('../lib/db');
//var bcrypt = require('bcrypt');
var Web3 = require("web3");
const { Keccak } = require('sha3');


function generateHash(pwd){
  const hash = new Keccak(256);
  hash.update(pwd)
  return hash.digest('hex')
}

web3 = new Web3(new Web3.providers.WebsocketProvider("ws://155.230.16.117:7545"))



module.exports = function (passport) {
  router.get('/login', function (request, response) {
    // login 에러 발생시 출력
    var fmsg = request.flash();
    var feedback = '';
    if (fmsg.error) {
      feedback = fmsg.error[0];
    }
    var title = 'WEB - login';
    
    var html = template.HTML(title,  `
      <div style="color:red;">${feedback}</div>
      <form action="/auth/login_process" method="post">
        <p><input type="text" name="email" placeholder="email" ></p>
        <p><input type="password" name="pwd" placeholder="password" ></p>
        <p>
          <input type="submit" value="login">
        </p>
      </form>
    `, '');
    response.send(html);
  });

  router.post('/login_process',
    passport.authenticate('local', 
    {
      // successRedirect: '/',
      failureRedirect: '/auth/login',
      //에러 플래시로 출력할 수 있도록
      failureFlash: true,
      successFlash: true
    }
    ), (request, response)=>{
      console.log('login!!')
      var post = request.body
      var email = post.email
      var pwd = post.pwd
      var ob = db.get('users').find({email:email}).value()
      web3.eth.personal.unlockAccount(ob.address, pwd,0).then(console.log)
      
      
      response.redirect('/')
      
    });

  router.get('/register', function (request, response) {
    //등록할때도 에러 플래시, 비밀번호 틀리다거나 등
    var fmsg = request.flash();
    var feedback = '';
    if (fmsg.error) {
      feedback = fmsg.error[0];
    }
    var title = 'WEB - login';
   
    var html = template.HTML(title, `
        <div style="color:red;">${feedback}</div>
        <form action="/auth/register_process" method="post">
          <p><input type="text" name="email" placeholder="email" ></p>
          <p><input type="password" name="pwd" placeholder="password" ></p>
          <p><input type="password" name="pwd2" placeholder="password" ></p>
          <p><input type="text" name="displayName" placeholder="display name" ></p>
          <p>
            <input type="submit" value="register">
          </p>
        </form>
      `, '');
    response.send(html);
  });

  router.post('/register_process', function (request, response) {
    var post = request.body;
    var email = post.email;
    var pwd = post.pwd;
    var pwd2 = post.pwd2;
    var displayName = post.displayName;
    if (pwd !== pwd2) {
      //이 경우 에러
      request.flash('error', 'Password must same!');
      response.redirect('/auth/register');
    }
    else if(db.get('users').find({email:email}).value() !== undefined){
      request.flash('error', 'The email already exist!!');
      response.redirect('/auth/register');

    } 
    else {
      //암호화해서 해시 
      console.log()
      var user={}
      web3.eth.personal.newAccount(pwd, (err, address)=>{
        

          user = {
            email: email,
            password: generateHash(pwd),
            displayName: displayName,
            address : address
          };
          //user 객체를 db에 저장
          db.get('users').push(user).write();
          var cloudAddr = db.get('cloud').value()[0].cloudAddr
          //console.log(cloudAddr)
          //register 후 바로 login
          web3.eth.personal.unlockAccount(user.address, pwd, 0).then(console.log)
          
          sendTransaction(request, response)
     
      })

      

      // bcrypt.hash(pwd, 10, function (err, hash) {
      //   var user = {
      //     id:shortid.generate(),
      //     email: email,
      //     password: hash,
      //     displayName: displayName,
      //   };
      //   //user 객체를 db에 저장
      //   db.get('users').push(user).write();
      //   //register 후 바로 login
      //   request.login(user, function (err) {
      //     console.log('redirect', err);
      //     return response.redirect('/');
      //   })
      // });
      
    }
  });

async function sendTransaction(request, response){
  var hash = await web3.eth.sendTransaction({
    from : cloudAddr,
    to : user.address,
    value : web3.utils.toWei('10', 'ether')
  })
  console.log(hash)

  request.login(user, function (err) {
    console.log(err);

    request.flash('success', user.address);
    return response.redirect('/');
  })
 
}


  router.get('/logout', function (request, response) {
    web3.eth.personal.lockAccount(request.user.address)
    .then(console.log('Account locked!'));
    request.logout();
    
    request.session.save(function () {
      response.redirect('/');
    });
  });

  return router;
}