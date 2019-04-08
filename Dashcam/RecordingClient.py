import sha3
import cv2
import glob
import os, sys
from socket import *
from umbral import pre, keys, signing, kfrags, config

private_key = keys.UmbralPrivateKey.from_bytes(b'l\x94\xc0 b\xf6\x9c9\x08\x19\xf9E3\r\x10\xce\x9af\xb1J!\x87\xaf\x7f\x91\r\xbf~z\x1c\xa4\xd2')
public_key = private_key.get_pubkey()

public_key_hex = public_key.to_bytes().hex()

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

ID = public_key_hex
print(ID)
H=[hash_function(ID.encode('utf-8')),'']


clientSocket.send(public_key_hex.encode('utf-8'))   ###ID 전송
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
                print('frame_hash: ', frame_hash)
                temp = frame_hash+file_name_hex+H[0]
                
                H[1] = hash_function(temp.encode('utf-8'))
                evid = public_key_hex+file_name_hex+H[0]+H[1]
                evid = evid.encode('utf-8') + hex(c).encode('utf-8')
                print(file_name)
                print('filename_hex: ' , file_name_hex)
                print('previous: ', H[0])
                print('current: ' , H[1])
           
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
        
       

