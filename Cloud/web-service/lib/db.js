var low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');
var adapter = new FileSync('../accountdb.json');
var db = low(adapter);
db.defaults({cloud : [{cloudAddr:'0xc9f6F1a0385DEA1ed0Bc95F41768Af637BA6F30F'}], users:[]}).write();
// if(db.get('admin').value()[0].cloudAddr === 'x'){
//     db.get('admin').set({cloudAddr: '0xb09e4d51e96ef03311dcb017a1e00070c78408c2'}).write()
// }
//console.log(db.get('admin').value()[0].address)
module.exports = db;