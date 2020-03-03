from umbral import pre, keys, signing, config
config.set_default_curve()
from Crypto.Cipher import AES
import sha3
from Crypto import Random
from Cipher import *

def generateHash(pwd):
    k = sha3.keccak_256()
    k.update(pwd.encode('utf-8'))
    return k.hexdigest()

email = input('email: ')
password = input('password: ')
key = generateKey(password)

password = generateHash(password)

myPrivateKey = keys.UmbralPrivateKey.from_bytes(decrypt(key, 'static/'+email+'PrivateKey.enc'))
myPublicKey = myPrivateKey.get_pubkey()
myPublicKeyHex = myPublicKey.to_bytes().hex().encode('utf-8')
mySigner = signing.Signer(private_key=myPrivateKey)
print(myPublicKeyHex)