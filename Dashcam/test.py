import sha3
import cv2
import glob
import os, sys

k = sha3.keccak_256()
k.update('pass00'.encode('utf-8'))
print(k.hexdigest())