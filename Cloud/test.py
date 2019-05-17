import sqlite3
from umbral import pre, keys, signing, kfrags, config
config.set_default_curve()
conn = sqlite3.connect('./evidence.db')
curs = conn.cursor()
curs.execute('SELECT * FROM requesterInfo WHERE requestContractAddress=?', ('0xDcA1fc8d001E839fd23f651957AC82DE29e05716',))
rows = curs.fetchall()
trans_kfs=''
trans_kfs=rows[0][2]

kfs = list()
kfs_temp = list()
for i in range(0,1) :
    kfs_temp.append(bytes.fromhex(trans_kfs)

# for i in kfs_temp :      
#     kfs.append(kfrags.KFrag.from_bytes(i))