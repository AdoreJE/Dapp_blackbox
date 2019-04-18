import sqlite3
conn = sqlite3.connect('./evidence.db')
curs = conn.cursor()

curs.execute('CREATE TABLE evidence(num int, accountAddress text, filename text, previous text, current text, PRIMARY KEY(accountAddress, filename))')
curs.execute('CREATE TABLE video (accountAddress text, filename text, evidenceContractAddress text, cipher text, capsule text, PRIMARY KEY(accountAddress, filename))')
curs.execute('CREATE TABLE contract (evidenceContractAddress text, time text, location text, PRIMARY KEY(evidenceContractAddress))')
curs.execute('CREATE TABLE requestContract (requesterAddress text, requestContractAddress text, evidenceContractAddress text, PRIMARY KEY(requesterAddress, requestContractAddress))')
curs.execute('CREATE TABLE requesterInfo (requestContractAddress text, ownerPublicKey text, kfrags text,  PRIMARY KEY(requestContractAddress))')
curs.execute('INSERT INTO evidence VALUES(?, ?, ?, ?, ?);', ('0', '', '', '', ''))
conn.commit()