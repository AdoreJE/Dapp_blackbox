import sha3
import cv2
import glob
import os, sys
from socket import *
from Cipher import *
from umbral import pre, keys, signing, kfrags, config
import time
config.set_default_curve()
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
print(myPublicKeyHex)
mySigner = signing.Signer(private_key=myPrivateKey)


serverName = '155.230.16.117'   # Set as IP address of server
serverPort = 15000
# print(len(password.encode('utf-8')))

while True:
    clientSocket = socket(AF_INET,SOCK_STREAM)
    a = clientSocket.connect_ex((serverName,serverPort))
    if a==0:
        try:
            # print(generateHash(email))
            # print(password)
            sendData = password + generateHash(email)
            clientSocket.send(sendData.encode('utf-8')) 
            #clientSocket.send(generateHash(email).encode('utf-8'))     
            data = clientSocket.recv(6).decode()
        except ConnectionResetError:
            # print('error')
            continue
        #신원 확인
        if '1' == data[0]:
            print('correct')
            request = data[1:]
            print(request)
            #send public key
            if request =='puKey':
                print(myPublicKeyHex)
                clientSocket.send(myPublicKeyHex)#66
            #send re-encryption key
            elif request =='reKey':
                data=clientSocket.recv(1024)
                yourPublicKey = data[:66]
                print(yourPublicKey)
                # print(myPublicKey.to_bytes().hex())
                 
                # cipher = data[66:186]
              
                #capsule = data[186:]
          

                # print(cipher)
               # print(capsule)
                yourPublicKey = pre.UmbralPublicKey.from_bytes(bytes.fromhex(yourPublicKey.decode()))
                # # print(yourPublicKey.to_bytes().hex())
               #rint(capsule)
                kfrags = pre.generate_kfrags(delegating_privkey=myPrivateKey,
                             signer=mySigner,
                             receiving_pubkey=yourPublicKey,
                             threshold=1,
                             N=1)
                clientSocket.send(myPublicKeyHex)
                #print(sent)
                # capsule.set_correctness_keys(delegating=myPublicKey,
                #                     receiving=yourPublicKey,
                #                     verifying=myPublicKey)
               
                # cfrags = list()           # Bob's cfrag collection
                # for kfrag in kfrags:
                #     cfrag = pre.reencrypt(kfrag, capsule)
                #     cfrags.append(cfrag)

                # for cfrag in cfrags:
                #     capsule.attach_cfrag(cfrag)

                # print('reencrpt')
                # print(capsule)
                for kfrag in kfrags:
                    clientSocket.send(kfrag.to_bytes())
                # time.sleep(5)
                # time.sleep(1)
                # clientSocket.close()
            elif request =='trans':
                data = clientSocket.recv(2048)
                cipher = data[:120]
                capsule = data[120:316]
                ownerPublicKey[316:382]
                trans_kfs = data[382:]

                print('cipher: ', cipher)
                print('capsule: ', capsule)
                print('ownerPublicKey: ', ownerPublicKey)
                print('trans_kfs: ', trans_kfs)
                capsule = pre.Capsule.from_bytes(bytes.fromhex(capsule.decode()), params = myPublicKey.params)  
                
                kfs = list()
                kfs_temp = list()
                for i in range(0,1):
                    kfs_temp.append(bytes.fromhex(trans_kfs.decode()))

                for i in kfs_temp:
                    kfs.append(kfrags.KFrag.from_bytes(i))
                ownerPublicKey = keys.UmbralPublicKey.from_bytes(bytes.fromhex(ownerPublicKey))
                capsule.set_correctness_keys(delegating=ownerPublicKey,
                                    receiving=myPublicKey,
                                    verifying=ownerPublicKey)

                # print(capsule)
                # print(kfs)
                cfrags = list()           # Bob's cfrag collection
                for kfrag in kfs:
                    cfrag = pre.reencrypt(kfrag, capsule)
                    cfrags.append(cfrag)

                for cfrag in cfrags:
                    capsule.attach_cfrag(cfrag)
                cleartext =  pre.decrypt(ciphertext=bytes.fromhex(cipher.decode()), capsule=capsule, decrypting_key=myPrivateKey)
                print(cleartext)# == plaintext

        elif '0' == data[0]:
            print('incorrect')
                
            # clientSocket.close()
        #time.sleep(1)
        print('close', time.time())
        clientSocket.close()
    #print('close')
    # clientSocket.close()
        

