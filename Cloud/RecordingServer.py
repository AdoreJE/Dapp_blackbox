from socket import *
import sqlite3
import threading

def parse_data(evid):
    ID = evid[:66]
    filename=evid[66:92]
    previous = evid[92:156]
    current = evid[156:220]
    c = evid[220:].decode()
    ID = ID.decode()
    filename = bytes.fromhex(filename.decode()).decode()
    previous = previous.decode()
    current = current.decode()
    c = int(c, 16)
    return ID, filename, previous, current, c

class ClientThread(threading.Thread):
    def __init__(self,clientAddress,clientsocket):
        threading.Thread.__init__(self)
        self.csocket = clientsocket
        self.conn = sqlite3.connect('./evidence.db', check_same_thread=False)
        self.curs = self.conn.cursor()
        ID = self.csocket.recv(1024)
        ID = ID.decode()
        self.curs.execute('SELECT * FROM evidence WHERE ID=?', (ID,))
        rows = self.curs.fetchall()
        if len(rows) == 0:
            self.csocket.send(str(1).encode())
        else:
            num = rows[len(rows)-1][0]
            self.csocket.send(str(num).encode())
        print ("New connection added: ", clientAddress)
    def run(self):
        print ("Connection from : ", clientAddress)
        #self.csocket.send(bytes("Hi, This is from Server..",'utf-8'))
        while True:
            evid = self.csocket.recv(1024)
            if len(evid) == 0:
                continue
            
            ID, filename, previous, current, c = parse_data(evid)
            print("ID: ", ID)
            print("filename: ",filename)
            print("previous: ", previous)
            print("current: ", current)
            print(c)
        
            try:
                self.curs.execute('INSERT INTO evidence VALUES(?, ?, ?, ?, ?);', (c, ID, filename, previous, current))
                self.conn.commit()
            except Exception as e:
                print(e)
                break

host = "155.230.16.117"
serverPort = 12000
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
