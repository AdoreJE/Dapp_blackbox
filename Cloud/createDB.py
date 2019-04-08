import sqlite3
conn = sqlite3.connect('./evidence.db')
curs = conn.cursor()

curs.execute('CREATE TABLE evidence(num int, ID text, filename text, previous text, current text, PRIMARY KEY(ID, filename))')
curs.execute('CREATE TABLE video (ID text, filename text, contractAddr text, cipher text, capsule text, PRIMARY KEY(ID, filename))')
curs.execute('CREATE TABLE contract (contractAddress text, time text, location text, PRIMARY KEY(contractAddress))')
# curs.execute('INSERT INTO evidence VALUES(?, ?, ?, ?, ?);', ('0', '', '', '', ''))
conn.commit()
# ID = '025e2eb969ca12e45c1a9492aa5cb7062d2bcfe45ba4e51759c1fc944213854097'
# filename = '20190317_1247'
# curs.execute('SELECT * FROM evidence WHERE ID=? and filename=?', (ID,filename))
# rows = curs.fetchall()
# num = rows[0][2]
# #curs.execute('SELECT  FROM evidence WHERE ID=? and filename=?', (ID,filename))
# print(num)