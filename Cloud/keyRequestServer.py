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
parser.add_argument("--evidenceContractAddress", type=str, help="input evidenceContractAddress",default=None)

args = parser.parse_args()
request = args.request
email = args.email
password = args.password
publicKey = args.publicKey
# print(publicKey)
evidenceContractAddress = args.evidenceContractAddress

conn = sqlite3.connect('../evidence.db')
curs = conn.cursor()
curs.execute('SELECT * FROM video WHERE evidenceContractAddress=?', (evidenceContractAddress,))
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
serverSocket.bind(('127.0.0.1', serverPort))

'''
    id pwd를 전송받아 사용자 확인
    검증 후 원하는 데이터 받기

'''

serverSocket.listen(1)
connectionSocket, addr = serverSocket.accept()
# print(addr)
receivedData = connectionSocket.recv(128)
receivedData = receivedData.decode()
receivedPassword = receivedData[:64]
receivedEmail = receivedData[64:128]


if generateHash(email) == receivedEmail and password == receivedPassword:
    print('correct')
    connectionSocket.send(('1'+request).encode('utf-8'))
    # connectionSocket.send(request.encode('utf-8'))
else:
    print('incorrect')
    connectionSocket.send('0'.encode('utf-8'))
    connectionSocket.close()
    serverSocket.close()
    exit()

if request == 'puKey':
    requesterPublicKey = connectionSocket.recv(66)
    print(requesterPublicKey[:66])
elif request =='reKey':
    print('rekey')
    
    # key = generateKey('1')
    # myPrivateKey = keys.UmbralPrivateKey.from_bytes(decrypt(key, 'static/user2PrivateKey.enc'))
    # myPublicKey = myPrivateKey.get_pubkey()
    # print(myPublicKey.to_bytes().hex())
    # print(len(myPublicKey.to_bytes().hex()))
    # requesterPublicKey = publicKey.to_bytes().hex().encode('utf-8')
   
    # data = requesterPublicKey+cipher
    connectionSocket.send(publicKey.encode())
    
    ownerPublicKey = connectionSocket.recv(66)
    # time.sleep(1)
    # print(ownerPublicKey)
    # print(time.time())

    # publicKey = keys.UmbralPublicKey.from_bytes(bytes.fromhex(publicKey))
    ownerPublicKey = keys.UmbralPublicKey.from_bytes(bytes.fromhex(ownerPublicKey.decode()))
    requesterPublicKey = keys.UmbralPublicKey.from_bytes(bytes.fromhex(publicKey))

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

#time.sleep(3)
# connectionSocket.close()
# print('server closed', time.time())
serverSocket.close()
exit()