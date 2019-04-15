import sha3
import cv2
import glob
import os, sys
from socket import *
from umbral import pre, keys, signing, kfrags, config
from Crypto.Cipher import AES
from Crypto import Random
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

# private_key = keys.UmbralPrivateKey.from_bytes(b'l\x94\xc0 b\xf6\x9c9\x08\x19\xf9E3\r\x10\xce\x9af\xb1J!\x87\xaf\x7f\x91\r\xbf~z\x1c\xa4\xd6')
# public_key = private_key.get_pubkey()

# public_key_hex = public_key.to_bytes().hex()

serverName = '155.230.16.117'   # Set as IP address of server
serverPort = 12000
clientSocket = socket(AF_INET,SOCK_STREAM)
clientSocket.connect((serverName,serverPort))


def get_file_name(video_path):
    parts = video_path.split(os.path.sep)
    sended = parts[2].split('_')[2]
    evented = parts[2].split('_')[3]
    dates = parts[2][:13]
    # ext = parts[2].split('.')[1]
    #filename_no_ext = filename.split('.')[0]
    return dates, sended, evented

def rename_file(video_path):
    parts = video_path.split(os.path.sep)
    dates, _, evented = get_file_name(video_path)
    os.rename(video_path, parts[0]+'/'+parts[1]+'/'+dates+'_1_'+evented)

def hash_function(data):
    k = sha3.keccak_256()
    k.update(data)
    return k.hexdigest()


H=[hash_function(accountAddress.encode('utf-8')),'']


clientSocket.send(accountAddress.encode('utf-8'))   ###ID 전송
c = clientSocket.recv(1024)
c = int(c.decode())
while True:
    folder = glob.glob(os.path.join('data/normal',"*"))
    folder.sort()
    for video_path in folder:
        file_name, sended, _= get_file_name(video_path)
        if sended == '1':
            continue
        
        file_name_hex = file_name.encode('utf-8').hex()
        vidcap = cv2.VideoCapture(video_path)
        success1, image1 = vidcap.read()
        if success1:
            vidcap.set(1, vidcap.get(7)-1)
            success2, image2 = vidcap.read()
            if success2:
                frame_hash = hash_function(image1+image2)
                
                temp = frame_hash.encode() + file_name.encode() + H[0].encode()

                # temp = frame_hash+file_name_hex+H[0]
                
                # H[1] = hash_function(temp.encode('utf-8'))
                H[1] = hash_function(temp)
                evid = accountAddress.encode('utf-8')+file_name.encode('utf-8')+H[0].encode('utf-8')+H[1].encode('utf-8') + str(c).encode('utf-8')
                print("-"*64)
                print('accountAddress: ', (accountAddress))
                print('file_name: ', (file_name))
                print('H[0]: ',(H[0]))
                print('H[1]: ', (H[1]))
                print('frame_hash: ', frame_hash)
                print('c: ', (str(c)))
           
        # print('H [i-1] : ' + H[0])
        # print('H [ i ] : ' + H[1])
        # print('H [fileName] : ' + H[2])
        # print("ID: ", public_key_hex)
        # print("filename: ",file_name)
        # print("previous: ", H[0])
        # print("current: ", H[1])
        # print(len(H[0]))
        
        # clientSocket.send(str.encode(ID))
        clientSocket.send(evid)
        rename_file(video_path)
        H[0] = H[1]
        c+=1
        
        
     
clientSocket.close()
        
       

