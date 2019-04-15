from socket import *
import sha3
import sqlite3
import os
import threading

def parse_data(evid):
    accountAddress = evid[:42]  #42
    filename=evid[42:63] #21
    cipher = evid[63:183] #120
    capsule = evid[183:379] #196
    contractAddress = evid[379:421] #42
    accountAddress = accountAddress.decode()
    filename = filename.decode()
   
  
    contractAddress = contractAddress.decode()

    # filename = bytes.fromhex(filename.decode()).decode()
    # cipher = bytes.fromhex(cipher.decode())
    # capsule = bytes.fromhex(capsule.decode())
    # contractAddress = bytes.fromhex(contractAddress.decode()).decode()
    return accountAddress, filename, cipher, capsule, contractAddress

def hash_function(data):
    k = sha3.keccak_256()
    k.update(data)
    return k.hexdigest()

def file_receive(csocket, filepath):
    size = csocket.recv(9)
    size = int(size.decode())
    print('size: ', size)
    #암호화된 영상 데이터
    data_transferred = 0
    unit = 1024
    with open(filepath, 'wb') as f:
        try:
            while True:
                if unit > size:
                    data = csocket.recv(size)
                    data_transferred += len(data)
                    f.write(data)
                    break
                
                data_transferred += unit
                
                if data_transferred < size:
                    data = csocket.recv(unit)
                    f.write(data)
                elif data_transferred == size:
                    data = csocket.recv(unit)
                    f.write(data)
                    break
                else:
                    unit = data_transferred % size
                    data = csocket.recv(1024-unit)
                    f.write(data)
                    data_transferred = data_transferred - unit
                    break
        except Exception as e:
            print(e)
    print('전송완료[%s], 전송량[%d]' %(filepath.split('/')[3],data_transferred))

class VerifyThread(threading.Thread):
    def __init__(self, accountAddress, filename, contractAddress, cipher, capsule):
        threading.Thread.__init__(self)
        self.accountAddress = accountAddress
        self.filename = filename
        self.contractAddress = contractAddress
        self.cipher = cipher
        self.capsule = capsule
        self.conn = sqlite3.connect('./evidence.db', check_same_thread=False)
        self.curs = self.conn.cursor()
    def run(self):
        print('verify the contract')
        #검증 수행
        ## 1. 컨트랙트 내의 frame hash 가져오기
        a = os.popen('node web-service/verify.js 0 ' + self.contractAddress)
        lines = a.read()
        #print(lines)
        
        frame_hash = lines.split('\'')[3]
        print('frame_hash: ',frame_hash)
        print('accountAddress: ', self.accountAddress)
        print("filename: ", self.filename[:13])
        self.curs.execute('SELECT * FROM evidence WHERE accountAddress=? and filename=?', (self.accountAddress,self.filename[:13]))
        rows = self.curs.fetchall()
        previous = rows[0][3]
        current = rows[0][4]

        temp = frame_hash.encode('utf-8') + self.filename[:13].encode('utf-8') + previous.encode('utf-8')
        result = hash_function(temp)
        print('current: ', current)
        print('result: ', result)
        if current == result:
            print('verify')
            #verify
            ## 2. contract의 isVerified 값 업데이트
            a = os.popen('node web-service/verify.js 1 ' + self.contractAddress)
            lines = a.read()
            print(lines)
            self.curs.execute('INSERT INTO video VALUES(?, ?, ?, ?, ?);', (self.accountAddress, self.filename, self.contractAddress, self.cipher, self.capsule))
            self.conn.commit()


class ClientThread(threading.Thread):
    def __init__(self,clientAddress,clientsocket):
        threading.Thread.__init__(self)
        self.csocket = clientsocket
        
    def run(self):
        while True:
            evid = self.csocket.recv(421)
            if len(evid) == 0:
                continue
            #db에 저장할 데이터 받아오기
            
            accountAddress, filename, cipher, capsule, contractAddress= parse_data(evid)
            print("-"*64)
            # print("accountAddress: ", accountAddress)
            # print("filename: ",filename)
            # print("cipher: ", cipher)
            # print("capsule: ", capsule)
            # print("contractAddress: ", contractAddress) #evidenceContract
            file_receive(self.csocket, 'web-service/public/frame/'+ contractAddress+'_frame1.jpg')
            file_receive(self.csocket, 'web-service/public/frame/'+ contractAddress+'_frame2.jpg')
            file_receive(self.csocket, 'web-service/public/video/'+ contractAddress+'.aes')
            newthread = VerifyThread(accountAddress, filename, contractAddress, cipher, capsule)
            newthread.start()
            

def main():
    host = "127.0.0.1"
    serverPort = 13000
    serverSocket = socket(AF_INET, SOCK_STREAM)

    serverSocket.bind((host, serverPort))
    serverSocket.listen(1)

    print("Server started")
    print("Waiting for client request..")
    while True:
        serverSocket.listen(1)
        clientsock, clientAddress = serverSocket.accept()
        newthread = ClientThread(clientAddress, clientsock)
        newthread.start()

main()