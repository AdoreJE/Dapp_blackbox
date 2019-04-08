// contract 
// ABI
exports.SearchABI = [{"constant":true,"inputs":[{"name":"_EvidAddress","type":"address"}],"name":"getData","outputs":[{"name":"","type":"int256"},{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getAddress","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_EvidAddress","type":"address"},{"name":"_time","type":"int256"},{"name":"_location","type":"int256"}],"name":"setEvidence","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]
exports.EvidenceABI = [{"constant":true,"inputs":[],"name":"time","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getData","outputs":[{"name":"_frame_hash","type":"string"},{"name":"_time","type":"int256"},{"name":"_location","type":"int256"},{"name":"_isVerified","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"frame_hash","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"location","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"s","type":"address"}],"name":"verify","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"isVerified","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getOwner","outputs":[{"name":"_owner","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_frame_hash","type":"string"},{"name":"_time","type":"int256"},{"name":"_location","type":"int256"}],"name":"setEvidence","outputs":[],"payable":true,"stateMutability":"payable","type":"function"}]
exports.ResponseABI = [{"constant":true,"inputs":[],"name":"get","outputs":[{"name":"_requesterAddr","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_requesterAddr","type":"address"},{"name":"_evidAddr","type":"address"}],"name":"set","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]
exports.RequestABI = [{"constant":true,"inputs":[],"name":"getData","outputs":[{"name":"_evidAddr","type":"address"},{"name":"_puk","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"REP","type":"address"},{"name":"_evidAddr","type":"address"},{"name":"_puk","type":"int256"}],"name":"requestVideo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_rekey","type":"int256"},{"name":"_link","type":"int256"}],"name":"setData","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getReKey","outputs":[{"name":"_rekey","type":"int256"},{"name":"_link","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]

// Data
exports.SearchData = '0x60806040526000805534801561001457600080fd5b5061042b806100246000396000f3fe608060405260043610610051576000357c01000000000000000000000000000000000000000000000000000000009004806338266b221461005657806338cc4831146100c25780639f2c39b41461012e575b600080fd5b34801561006257600080fd5b506100a56004803603602081101561007957600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610193565b604051808381526020018281526020019250505060405180910390f35b3480156100ce57600080fd5b506100d7610225565b6040518080602001828103825283818151815260200191508051906020019060200280838360005b8381101561011a5780820151818401526020810190506100ff565b505050509050019250505060405180910390f35b34801561013a57600080fd5b506101916004803603606081101561015157600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190803590602001909291905050506102b3565b005b600080600260008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000154600260008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206001015491509150915091565b606060018054806020026020016040519081016040528092919081815260200182805480156102a957602002820191906000526020600020905b8160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001906001019080831161025f575b5050505050905090565b60018390806001815401808255809150509060018203906000526020600020016000909192909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050610324838383610329565b505050565b604080519081016040528083815260200182815250600260008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082015181600001556020820151816001015590505060018390806001815401808255809150509060018203906000526020600020016000909192909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050505056fea165627a7a72305820aeb676f0a2bfe443247794abc989d24403b47a5db2d1a91a56da6e2d5e4f337b0029'
exports.EvidenceData = '0x6080604052730c8f9dfe4fcdbab8daa6d8e08b661c7c35b44b5d600460016101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555034801561006557600080fd5b5061088a806100756000396000f3fe608060405260043610610093576000357c01000000000000000000000000000000000000000000000000000000009004806316ada547146100985780633bc5de30146100c357806344f47d471461016c578063516f279e146101fc57806363a9c3d71461022757806380007e8314610278578063893d20e8146102a75780638da5cb5b146102fe578063ef8a663014610355575b600080fd5b3480156100a457600080fd5b506100ad610424565b6040518082815260200191505060405180910390f35b3480156100cf57600080fd5b506100d861042a565b604051808060200185815260200184815260200183151515158152602001828103825286818151815260200191508051906020019080838360005b8381101561012e578082015181840152602081019050610113565b50505050905090810190601f16801561015b5780820380516001836020036101000a031916815260200191505b509550505050505060405180910390f35b34801561017857600080fd5b506101816104f3565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156101c15780820151818401526020810190506101a6565b50505050905090810190601f1680156101ee5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561020857600080fd5b50610211610591565b6040518082815260200191505060405180910390f35b34801561023357600080fd5b506102766004803603602081101561024a57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610597565b005b34801561028457600080fd5b5061028d6106d3565b604051808215151515815260200191505060405180910390f35b3480156102b357600080fd5b506102bc6106e6565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561030a57600080fd5b5061031361070f565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6104226004803603606081101561036b57600080fd5b810190808035906020019064010000000081111561038857600080fd5b82018360208201111561039a57600080fd5b803590602001918460018302840111640100000000831117156103bc57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192908035906020019092919080359060200190929190505050610734565b005b60025481565b606060008060006001600254600354600460009054906101000a900460ff16838054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156104de5780601f106104b3576101008083540402835291602001916104de565b820191906000526020600020905b8154815290600101906020018083116104c157829003601f168201915b50505050509350935093509350935090919293565b60018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156105895780601f1061055e57610100808354040283529160200191610589565b820191906000526020600020905b81548152906001019060200180831161056c57829003601f168201915b505050505081565b60035481565b600460019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614156106d0576001600460006101000a81548160ff0219169083151502179055508073ffffffffffffffffffffffffffffffffffffffff16639f2c39b4306002546003546040518463ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018381526020018281526020019350505050600060405180830381600087803b1580156106b757600080fd5b505af11580156106cb573d6000803e3d6000fd5b505050505b50565b600460009054906101000a900460ff1681565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550826001908051906020019061078a9291906107b9565b5081600281905550806003819055506000600460006101000a81548160ff021916908315150217905550505050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106107fa57805160ff1916838001178555610828565b82800160010185558215610828579182015b8281111561082757825182559160200191906001019061080c565b5b5090506108359190610839565b5090565b61085b91905b8082111561085757600081600090555060010161083f565b5090565b9056fea165627a7a72305820d6110fb99a224957cc64d02f5cc79f1a31908350a71d37add213af5bea121bc80029'
exports.ResponseData = '0x608060405234801561001057600080fd5b506104f4806100206000396000f3fe608060405260043610610046576000357c0100000000000000000000000000000000000000000000000000000000900480636d4ce63c1461004b57806389675cac146100b7575b600080fd5b34801561005757600080fd5b50610060610128565b6040518080602001828103825283818151815260200191508051906020019060200280838360005b838110156100a3578082015181840152602081019050610088565b505050509050019250505060405180910390f35b3480156100c357600080fd5b50610126600480360360408110156100da57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506101f5565b005b60606000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000018054806020026020016040519081016040528092919081815260200182805480156101eb57602002820191906000526020600020905b8160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190600101908083116101a1575b5050505050905090565b600081905060008173ffffffffffffffffffffffffffffffffffffffff1663893d20e86040518163ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040160206040518083038186803b15801561025e57600080fd5b505afa158015610272573d6000803e3d6000fd5b505050506040513d602081101561028857600080fd5b810190808051906020019092919050505090506000808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000018490806001815401808255809150509060018203906000526020600020016000909192909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505060008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600001805490509050836000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160008060008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000016001850381548110151561041e57fe5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550505050505056fea165627a7a7230582029822a3f6311d59951ed4f95fcd02565601a3bb8d586f4766cc1bf564e0a55960029'
exports.RequestData = '0x608060405234801561001057600080fd5b5033600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610515806100616000396000f3fe60806040526004361061005c576000357c0100000000000000000000000000000000000000000000000000000000900480633bc5de301461006157806371da1d30146100bf578063d0e60d081461013a578063ffd759541461017f575b600080fd5b34801561006d57600080fd5b506100766101b1565b604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390f35b3480156100cb57600080fd5b50610138600480360360608110156100e257600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506101e2565b005b34801561014657600080fd5b5061017d6004803603604081101561015d57600080fd5b810190808035906020019092919080359060200190929190505050610378565b005b34801561018b57600080fd5b5061019461047c565b604051808381526020018281526020019250505060405180910390f35b600080600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600454915091509091565b8060048190555081600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508273ffffffffffffffffffffffffffffffffffffffff166389675cac30846040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200192505050600060405180830381600087803b15801561035b57600080fd5b505af115801561036f573d6000803e3d6000fd5b50505050505050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663893d20e86040518163ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040160206040518083038186803b1580156103fb57600080fd5b505afa15801561040f573d6000803e3d6000fd5b505050506040513d602081101561042557600080fd5b810190808051906020019092919050505073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614156104785781600281905550806003819055505b5050565b600080600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614156104e457600254600354915091506104e5565b5b909156fea165627a7a72305820208344edce2668cd7984c10b1e29c7974330ff8dc4c5a166cd57934f963e756b0029'

// contract address
exports.SearchAddress = '0xFc64042BB506A7587Ff5fCEb7b443E20C60CbcC3'
exports.ResponseAddress = '0xeaD3D8a4CEBBC3a551C7E0B57e94761247D19091'
exports.RequestAddress =  '0xCA0182aaaFA9C1442c1c6E1d6eD7AC037B079139'
//account
// //ganache mac
// exports.cloudAddr = '0x0C8f9DFe4fCDBaB8dAa6d8e08b661C7C35b44b5d'
// exports.cloudPrivateKey = Buffer.from('2bd27a5d14a2ab2762d939d3de81a39b2712598410ae7ad0441affeed7b3a194', 'hex')

// exports.dashcamAddr1 = '0x72b514013354051E5f1BA322784d668d913B03E7'
// exports.dashcamPrivateKey1 = Buffer.from('d6f6cfc116923b8bf05824d259b10d1f3751531c1a67fb5c9624f6da88e13b30', 'hex')

// exports.dashcamAddr2 = '0x197bb7C88F6b29764a92670CE9d6Bc564f4CC5C4'
// exports.dashcamPrivateKey2 = Buffer.from('27144102c1bc8853d8ac3047be7e4376b8beb4aebc1e06bce6a76f55e49268b5', 'hex')

// exports.dashcamAddr3 = '0xCc908b6f35287F2Ecc74eeD824B5Ec58159f1cfb'
// exports.dashcamPrivateKey3 = Buffer.from('60bf1bfba29d692f46490fdd14d5edabec048ad0a52122fb41ec33a096d30a39', 'hex')

// exports.requesterAddr1 = '0x02b3fdf11043D68E7B23CE67Ba6088Cf49Cf93A5'
// exports.requesterPrivateKey4 = Buffer.from('caa0b378508cfb4f645387534d11610c7515eedb9e20adc6040629f2c9b67a02', 'hex')

// exports.requesterAddr2 = '0x720e7dB3CC8F80aCECd7c107eBD0FBB876f8d256'
// exports.requesterPrivateKey5 = Buffer.from('81273c8e65cf594d1808753c8e6c3948bf88690caa9b5f1d18ffe564e906f541', 'hex')

//ganache window

exports.cloudAddr = '0x42808FFb8ed074646ac65aA47510328BEFBBA3a2'
exports.dashcamAddr1 = '0xB14Ea779836549c9E3B32D8251725110697bf4c9'
exports.requesterAddr1 = '0x73079d95ba2Fbc8416839A4e1C376555Fb4f3cc7'


// exports.cloudAddr = '0x888b5096eeabc10e911527b1d21f9f04cf8c544d'
// exports.dashcamAddr1 = '0xb87291aadb4a1a7da5c16cb87566e79feebb05b8'
// exports.requesterAddr1 = '0xba588263ebaf07c06b895035ec2333f90111e1ff'
