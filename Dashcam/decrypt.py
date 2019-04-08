from Crypto.Cipher import AES
import struct, hashlib, time
def decrypt_file(key, in_filename, out_filename, chunksize=24 * 1024):
    with open(in_filename, 'rb') as infile:
        origsize = struct.unpack('<Q', infile.read(struct.calcsize('Q')))[0]
        iv = infile.read(16)
        decryptor = AES.new(key, AES.MODE_CBC, iv)
        with open(out_filename, 'wb') as outfile:
            while True:
                chunk = infile.read(chunksize)
                if len(chunk) == 0:
                    break
                outfile.write(decryptor.decrypt(chunk))
            outfile.truncate(origsize)

key = b'\xd4i\x8e\xdb\xdf\xe6\xfd\xab\x1b@!\x92\xe4\xe3\xee%\x9e\x99\xd4\xdb\x8f\xf71L\x82o%\xd4\x93\xf1*O'
decrypt_file(key, in_filename='data/encrypt/20190317_1247.mp4.aes', out_filename='data/decrypt/original.mp4')
print ('Decrypt Done !')