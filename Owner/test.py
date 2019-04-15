from umbral import pre, keys, signing, config
config.set_default_curve()
from Crypto.Cipher import AES
import sha3
from Crypto import Random

privateKey = keys.UmbralPrivateKey.gen_key()
publicKey = privateKey.get_pubkey()

a = pre.UmbralPublicKey.from_bytes(b'\x03@d0\xc8\xd9\xf9VtMO\xe3\xa2\xee\x9c\x83\xa8fyT\xc2z<8y\x90\x0bA\xb8\xd5\x0b&\xbc')
print(a.to_bytes())