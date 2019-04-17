from socket import *
import sys
import argparse
import sqlite3
import sha3
import os
import time
from umbral import pre, keys, signing, kfrags, config
import threading
from Cipher import *
config.set_default_curve()
def generateHash(pwd):
    k = sha3.keccak_256()
    k.update(pwd.encode('utf-8'))
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

'''
class ClientThread(threading.Thread):
    def __init__(self, connectionSocket, addr, args, cipher):
        threading.Thread.__init__(self)
        self.csocekt = connectionSocket
        receivedData = self.csocekt.recv(128)
        receivedData = receivedData.decode()
        receivedPassword = receivedData[:64]
        receivedEmail = receivedData[64:128]

        self.request = args.request
        self.email = args.email
        self.password = args.password
        self.publicKey = args.publicKey
        self.evidenceContractAddress = args.evidenceContractAddress
        self.cipher = cipher


        if generateHash(self.email) == receivedEmail and self.password == receivedPassword:
            print('correct')
            self.csocekt.send('1'.encode('utf-8'))
            self.csocekt.send(self.request.encode('utf-8'))
        else:
            print('incorrect')
            self.csocekt.send('0'.encode('utf-8'))
            serverSocket.close()
            exit()
    
    def run(self):
        os._exit(0)
        pass
        # if self.request == 'puKey':
        #     requesterPublicKey = connectionSocket.recv(66)
        #     print(requesterPublicKey[:66])
        # elif self.request =='reKey':
        #     print('rekey')
            
            # requesterPublicKey = self.publicKey.encode('utf-8')
            # connectionSocket.send(requesterPublicKey) #66
            # connectionSocket.send(self.cipher) #60
            # # ownerPublicKey = connectionSocket.recv(66)
            # # print(ownerPublicKey)
            
'''






# exit()
parser = argparse.ArgumentParser(description='')
parser.add_argument("--request", type=str, help="input request type")
parser.add_argument("--email", type=str, help="input email")
parser.add_argument("--password", type=str, help="input password")
parser.add_argument("--publicKey", type=str, help="input requester's publicKey", default=None)
parser.add_argument("--evidenceContractAddress", type=str, help="input evidenceContractAddress",default="test")
parser.add_argument("--rekey", type=str, help="input rekey", default=None)
args = parser.parse_args()
request = args.request
# print(request)
email = args.email
# print(email)
password = args.password
# print(password)
publicKey = args.publicKey

# print(publicKey)
evidenceContractAddress = args.evidenceContractAddress
rekey = args.rekey
# print(evidenceContractAddress)
conn = sqlite3.connect('../evidence.db')
curs = conn.cursor()
curs.execute('SELECT * FROM video WHERE evidenceContractAddress=?', (evidenceContractAddress[1:-1],))
rows = curs.fetchall()
#print(rows)
cipher=''
capsule=''
if len(rows) != 0:
    cipher = rows[0][3]
    capsule = rows[0][4]
    # print(capsule)


serverPort = 15000
serverSocket = socket(AF_INET, SOCK_STREAM)
serverSocket.bind(('', serverPort))

'''
    id pwd를 전송받아 사용자 확인
    검증 후 원하는 데이터 받기

'''

serverSocket.listen(1)
connectionSocket, addr = serverSocket.accept()
# print(addr)
receivedData = connectionSocket.recv(1024)
# print(email)
receivedData = receivedData.decode()
receivedPassword = receivedData[:64]
receivedEmail = receivedData[64:128]
# print(generateHash(email))
# print(receivedPassword)
# print(password[1:-1])
# print(receivedEmail)

# time.sleep(1)
if generateHash(email[1:-1]) == receivedEmail and password[1:-1] == receivedPassword:
    print('correct')
    connectionSocket.send(('1'+request[1:-1]).encode('utf-8'))
    # connectionSocket.send(request.encode('utf-8'))
else:
    print('incorrect')
    connectionSocket.send('0'.encode('utf-8'))
    connectionSocket.close()
    serverSocket.close()
    exit()

if request[1:-1] == 'puKey':
    requesterPublicKey = connectionSocket.recv(66)
    print(requesterPublicKey.decode())
elif request[1:-1] =='reKey':
    print('rekey')
    
    # key = generateKey('1')
    # myPrivateKey = keys.UmbralPrivateKey.from_bytes(decrypt(key, 'static/user2PrivateKey.enc'))
    # myPublicKey = myPrivateKey.get_pubkey()
    # print(myPublicKey.to_bytes().hex())
    # print(len(myPublicKey.to_bytes().hex()))
    # requesterPublicKey = publicKey.to_bytes().hex().encode('utf-8')
   
    # data = requesterPublicKey+cipher
    
    connectionSocket.send(publicKey[1:-1].encode())
    
    ownerPublicKey = connectionSocket.recv(66)
    print(ownerPublicKey)
    # time.sleep(1)
    # print(ownerPublicKey)
    # print(time.time())

    # publicKey = keys.UmbralPublicKey.from_bytes(bytes.fromhex(publicKey))
    ownerPublicKey = keys.UmbralPublicKey.from_bytes(bytes.fromhex(ownerPublicKey.decode()))
    requesterPublicKey = keys.UmbralPublicKey.from_bytes(bytes.fromhex(publicKey[1:-1]))

    capsule = pre.Capsule.from_bytes(bytes.fromhex(capsule.decode()), params = requesterPublicKey.params)  
    # print(capsule)


    kfs = list()
    kfs_temp = list()
    for i in range(0,1):
        kfs_temp.append(connectionSocket.recv(1024))

    for i in kfs_temp:
        kfs.append(kfrags.KFrag.from_bytes(i))
        

    # print('bpublickey: ', publicKey.to_bytes().hex())
    capsule.set_correctness_keys(delegating=ownerPublicKey,
                                    receiving=requesterPublicKey,
                                    verifying=ownerPublicKey)

    cfrags = list()           # Bob's cfrag collection
    for kfrag in kfs:
        cfrag = pre.reencrypt(kfrag, capsule)
        cfrags.append(cfrag)

    for cfrag in cfrags:
        capsule.attach_cfrag(cfrag)

    print(capsule.to_bytes().hex())
    
    
    # cleartext =  pre.decrypt(ciphertext=bytes.fromhex(cipher.decode()), capsule=capsule, decrypting_key=myPrivateKey)
    # print(cleartext)# == plaintext
elif request[1:-1] =='trans':
    #encrypted file transfer
    print(rekey)
    connectionSocket.send(rekey.encode('utf-8'))
    # file_transfer()

#time.sleep(3)
# connectionSocket.close()
# print('server closed', time.time())
serverSocket.close()
exit()