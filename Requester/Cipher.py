from Crypto.Cipher import AES
from Crypto import Random
import sha3

def generateKey(pwd):
    k = sha3.keccak_256()
    k.update(pwd.encode('utf-8'))
    return k.digest()

def encrypt( key, input, out_filename='privateKey.enc'):
        iv = Random.new().read( AES.block_size )
        encryptor = AES.new( key, AES.MODE_CBC, iv )
        with open(out_filename, 'wb') as outfile:
            outfile.write(iv)
            outfile.write(encryptor.encrypt(input))

def decrypt(key, in_filename):
    with open(in_filename, 'rb') as infile:
        raw = infile.read()
        iv = raw[:16]
        privateKey = raw[16:]
        decryptor = AES.new(key, AES.MODE_CBC, iv)
        return decryptor.decrypt(privateKey)  
