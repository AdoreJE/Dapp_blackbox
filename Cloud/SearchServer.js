
var express = require('express')
var fs =require('fs')
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('evidence.db');
var path = require('path')
var app = express()
const { exec } = require('child_process');
const { spawn } = require('child_process');
var Web3 = require("web3");
var MyConstant= require('../Constant/constant.js')
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

const cloudAddress = MyConstant.cloudAddress
const cloudPrivateKey = MyConstant.cloudPrivateKey
const SearchContract = new web3.eth.Contract(MyConstant.SearchABI, MyConstant.SearchAddress)
const ResponseContract = new web3.eth.Contract(MyConstant.ResponseABI, MyConstant.ResponseAddress)

app.use(express.static(path.join(__dirname, 'data/frame')));

app.get('/', (req,res)=>{
 var template = `
 <!doctype html>
 <html>
  <head>
    <title>Search</title>
    <meta charset="utf-8">
  </head>
 
  <body>
    <a href="/login">login</a>
    <h1><a href="index.html">WEB</a></h1>
    <form action="/search" method="get">
      <p><input type="text" name="time" placeholder="time"></p>
      <p><input type="text" name="location" placeholder="location"></p>
     
      <p>
        <input type="submit">
      </p>
    </form>
  </body>
 </html>
 `
  res.send(template)
  // console.log(__dirname)
  // var html = loadImage('1.jpg', '2.jpg')
  //   res.send(html)
})
app.get('/login', function (request, response) {
 
  var title = 'WEB - login';
  var html = `
    <div style="color:red;">Login</div>
    <form action="/auth/login_process" method="post">
      <p>ID<input type="text" name="email" placeholder="email" value="egoing7777@gmail.com"></p>
      <p>PASS<input type="password" name="pwd" placeholder="password" value="111111"></p>
      <p>
        <input type="submit" value="login">
      </p>
    </form>
  `
  response.send(html);
});
app.post('/login_process',
passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
  successFlash: true
}));

addr=[]
app.get('/search',(req,res)=>{
   console.log('\nSearch Start!')
    db.all('SELECT * FROM contract WHERE time=? and location=?', [req.query.time,req.query.location], (err, row)=>{
      var html=''
        for(var i = 0;i<row.length;i++){
          addr[i] = row[i].contractAddress
          
          html+=loadImage(addr[i]+'__frame1.jpg', addr[i]+'__frame2.jpg', i)
          console.log(`${i}th evidence contract addr: ${addr[i]}`)
        }
        res.send(html+`<script src="button.js"></script>`)
    })
    // var html = loadImage('1.jpg', '2.jpg')
    // res.send(html) 
})

app.listen(3000,()=>{

})

function loadImage(image1, image2, i){
  var html = `
  <div style="width:1000px; height:250px; border:1px solid; ">
    <div style="width:400px; height:200px;  float:left">
      <img src = "${image1}" style="width:399px;   "/>
    </div>
    <div style="width:400px; height:200px;  float:left">
      <img src = "${image2}" style="width:399px; "/>
    </div>
   
    
    <div style="width:150px; height:230px;  float:left; ">
      <form action="/clicked" method="GET" onsubmit="return false;">
        <input type="submit" class="button" id="myButton${i}" value="request" style="margin:100px 0 0 30px"  ></button>
       </form>     
    </div>

    <div style="width:800px; text-align:center; margin:0; border:1px solid;">
    images
    </div>
    
  </div>
  
  `
  return html
}

//버튼 클릭했을때 요청 시나리오대로 
app.get('/clicked', (req, res) => {
  console.log("\n\nrequest Start!")
  console.log("evidence Address: ", addr[req.query.id])
  
  exec(`node deployRequest.js 0 ${addr[req.query.id]}` , (err, stdout, stderr)=>{
    if(err){
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  })
  res.send(req.query.id)
  
});

app.get('/check', (req, res)=>{
  ResponseContract.methods.get().call({from:MyConstant.dashcamAddr1}, (err, result)=>{
    console.log(result)
    var html = `<html>
    <head> 
    </head>
    <body>
`
    for(var i = 0;i<result.length;i++){
      html += `
      <p>${result[i]}
      <a href="checkVideo?address=${result[i]}">
      <input type="button" value="영상확인" onclick="movepage1()"></a>
      <input type="button" value="승인"></input>
      <input type="button" value="거부"></input>
      </p>`
    }
    html += ` </body>
    <script>
      function movepage1(){
        location.href = "/checkVideo";
      }
      </script>
    </html>`
    res.send(html)
  })
})

app.get("/checkVideo", (req,res)=>{
  var requestAddress = req.query.address
  var requestContract = web3.eth.Contract(MyConstant.RequestABI, requestAddress)
  requestContract.methods.getData().call({from : MyConstant.dashcamAddr1}, (err, result)=>{
    var image1 = result[0]+'__frame1.jpg'
    var image2 = result[0]+'__frame2.jpg'
    var html=`<div style="width:1000px; height:250px; border:1px solid; ">
    <div style="width:400px; height:200px;  float:left">
      <img src = "${image1}" style="width:399px;   "/>
    </div>
    <div style="width:400px; height:200px;  float:left">
      <img src = "${image2}" style="width:399px; "/>
    </div>`
    res.send(html)
  })
  
})


