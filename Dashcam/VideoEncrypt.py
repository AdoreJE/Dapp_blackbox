import sha3
import cv2
import glob
import os, sys
from socket import *
from umbral import pre, keys, signing, kfrags, config
import struct, hashlib, time
import binascii
from Crypto.Cipher import AES
from Crypto import Random
from Naked.toolshed.shell import execute_js, muterun_js
import subprocess
import time

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

email = input('email: ')
password = input('password: ')
f = open('static/'+email+'AccountInfo.txt', 'r')
accountAddress = f.read()


key = generateKey(password)
private_key = keys.UmbralPrivateKey.from_bytes(decrypt(key, 'static/'+email+'PrivateKey.enc'))
public_key = private_key.get_pubkey()
# public_key_hex = public_key.to_bytes().hex() #ID

serverName = '155.230.16.117'   # Set as IP address of server
serverPort = 13000
clientSocket = socket(AF_INET,SOCK_STREAM)
clientSocket.connect((serverName,serverPort))
c=0
# def get_file_name(video_path):
#     parts = video_path.split(os.path.sep)
#     filename = parts[2]
#     filename_no_ext = filename.split('.')[0]
#     return filename_no_ext, filename
def get_file_name(video_path):
    parts = video_path.split(os.path.sep)
    sended = parts[2].split('_')[2]
    evented = parts[2].split('_')[3][0]
    dates = parts[2][:13]
    ext = parts[2].split('.')[1]
    #filename_no_ext = filename.split('.')[0]
    return dates, sended, evented, ext

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

def encrypt_file(key, in_filename, out_filename=None, chunksize=65536):
    if not out_filename:
        out_filename = in_filename + '.enc'
    iv = 'initialvector123'.encode('utf-8')
    encryptor = AES.new(key, AES.MODE_CBC, iv)
    filesize = os.path.getsize(in_filename)
    with open(in_filename, 'rb') as infile:
        with open(out_filename, 'wb') as outfile:
            outfile.write(struct.pack('<Q', filesize))
            outfile.write(iv)
            while True:
                chunk = infile.read(chunksize)
                if len(chunk) == 0:
                    break
                elif len(chunk) % 16 != 0:
                    chunk += b' ' * (16 - len(chunk) % 16)
                outfile.write(encryptor.encrypt(chunk))

def make_pass():
    timekey = int(time.time())
    return str(timekey).encode('utf-8')

def hash_function(data):
    k = sha3.keccak_256()
    k.update(data)
    return k.hexdigest()


def file_transfer(filepath):
    # 9byte 파일 크기 전송
    # 1
    size = os.path.getsize(filepath)
    size = str(size).encode()
    while len(size) < 9:
        size = b'0'+size
    
    print("size :", size)
    clientSocket.send(size)
    
    data_transferred = 0
    with open(filepath, 'rb') as f:
        try:
            data = f.read(1024)
            while data:
                data_transferred += clientSocket.send(data)
                data = f.read(1024)
        except Exception as e:
            print(e)
    print('전송완료[%s], 전송량[%d]' %(filepath.split('/')[2],data_transferred))

def main():
    
    print(key)
    
    while True:
        folder = glob.glob(os.path.join('data/normal',"*"))
        folder.sort()

        for video_path in folder:
            dates, _, evented, ext= get_file_name(video_path)
            
            if evented == '0':
                continue
                
            contractAddress=''
            vidcap = cv2.VideoCapture(video_path)
            success1, image1 = vidcap.read()
            if success1:
                cv2.imwrite('data/accident/'+dates+'_frame1.jpg', image1)
                vidcap.set(1, vidcap.get(7)-1)
                success2, image2 = vidcap.read()
                if success2:
                    frame_hash = hash_function(image1+image2)
                    
                    cv2.imwrite('data/accident/'+dates+'_frame2.jpg', image2)
                    print('frame_hash: ', frame_hash)
                    print('\n\n')
                    a = os.popen('node deployEvidence.js ' +frame_hash+' '+email+' '+password)
                    lines = a.readlines()
                    
                
                    print(lines)
                    contractAddress = lines[2][:-1]
                    #print(len(contractAddress.hex()))

            filename = dates+'.'+ext
            print(filename)
            if evented == '0':
                continue
            
            encrypted_file_name = filename + '.aes'
            encrypt_file(key, video_path, out_filename='data/encrypt/'+filename+'.aes')
            print ('Encrypt Done !')
            
            cipher, capsule = pre.encrypt(public_key, key)
            print("-"*64)
            print('accountAddress: ', (accountAddress))
            print('encrypted_file_name:',(encrypted_file_name))
            print('cipher:',(cipher.hex()))
            print('capsule:',(capsule.to_bytes().hex()))
            print(capsule)
            print('contractAddress:',(contractAddress))
           
            data = accountAddress.encode('utf-8') + encrypted_file_name.encode('utf-8') + cipher.hex().encode('utf-8') + capsule.to_bytes().hex().encode('utf-8') + contractAddress.encode('utf-8')
            clientSocket.send(data)
            
            file_transfer('data/accident/'+dates+'_frame1.jpg')
            file_transfer('data/accident/'+dates+'_frame2.jpg')
            file_transfer('data/encrypt/'+ encrypted_file_name)
            #time.sleep(1)
        break

main()
