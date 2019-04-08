import cv2

vidcap = cv2.VideoCapture('1.mp4')
success1, image1 = vidcap.read()
print(vidcap.get(7))
if success1:
    cv2.imwrite('frame1.jpg', image1)
    vidcap.set(1, vidcap.get(7)-1)
    success2, image2 = vidcap.read()
    if success2:
        cv2.imwrite('frame2.jpg', image2)