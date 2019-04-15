var low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');
var adapter = new FileSync('../accountdb.json');
var db = low(adapter);
db.defaults({cloud : [{cloudAddr:'0xAB72FD06836Dff4Da3Cb22534C3936a02679e134'}], users:[]}).write();
// if(db.get('admin').value()[0].cloudAddr === 'x'){
//     db.get('admin').set({cloudAddr: '0xb09e4d51e96ef03311dcb017a1e00070c78408c2'}).write()
// }
//console.log(db.get('admin').value()[0].address)
module.exports = db;