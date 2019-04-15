from umbral import pre, keys, signing, config
config.set_default_curve()
from Crypto.Cipher import AES
import sha3
from Crypto import Random

def generateKey(pwd):
    k = sha3.keccak_256()
    k.update(pwd.encode('utf-8'))
    return k.digest()

def encrypt( key, input, out_filename='privateKey.enc'):
        iv = Random.new().read( AES.block_size )
        encryptor = AES.new( key, AES.MODE_CBC, iv )
        with open('static/'+out_filename, 'wb') as outfile:
            outfile.write(iv)
            outfile.write(encryptor.encrypt(input))

def decrypt(key, in_filename):
    with open('static/'+in_filename, 'rb') as infile:
        raw = infile.read()
        iv = raw[:16]
        privateKey = raw[16:]
        decryptor = AES.new(key, AES.MODE_CBC, iv)
        return decryptor.decrypt(privateKey)  

email = input('email: ')
password = input('password: ')
accountAddress = input('accountAddress: ')
key = generateKey(password)

privateKey = keys.UmbralPrivateKey.gen_key()
publicKey = privateKey.get_pubkey()

with open('static/'+email+'AccountInfo.txt', 'w') as outfile:
        outfile.write(accountAddress)
encrypt(key, privateKey.to_bytes(), email+'privateKey.enc')
print(privateKey.to_bytes())
print(decrypt(key, email+'privateKey.enc'))
