const { Keccak } = require('sha3');
 
const hash = new Keccak(256);
 
hash.update('pass00');
 
console.log(hash.digest('hex'));
hash.update('pass00')
console.log(hash.digest('hex'));
