var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');
var auth = require('../lib/auth');

router.get('/', function (request, response) {
  //성공할 경우 출력 reload하면 없어짐
  var fmsg = request.flash();
  var feedback = '';
  if(fmsg.success){
    feedback = fmsg.success[0];
  }else if(fmsg.error){
    feedback = fmsg.error[0];
  }
  var title = 'Welcome';
  // var description = 'Hello, Node.js';
  // var list = template.list(request.list);
  var html = template.HTML(title, 
    `
      <div style="color:blue;">${feedback}</div>
      <h2>${title}</h2>
      `,
    `
      <p><a href="/topic/search">search</a></p>
      <p><a href="/topic/owner">owner</a></p>
      <p><a href="/topic/requester">requester</a><p>
    `,
    auth.statusUI(request, response)
  );
  response.send(html);
});

module.exports = router;