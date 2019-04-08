import sha3
import cv2
import glob
import os, sys



folder = glob.glob(os.path.join('data/normal',"*"))
folder.sort()
for video_path in folder:
    
    vidcap = cv2.VideoCapture(video_path)
    success1, image1 = vidcap.read()
    if success1:
        vidcap.set(1, vidcap.get(8))
        success2, image2 = vidcap.read()
        if success2:
            k = sha3.keccak_256()
            k.update(image1+image2)
            frame_hash = k.hexdigest()
            print(frame_hash)
            