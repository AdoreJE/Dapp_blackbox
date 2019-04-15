
# # parser.py
import requests
from bs4 import BeautifulSoup as bs
# 로그인할 유저정보를 넣어주자 (모두 문자열)
url = 'http://localhost:3000/'

LOGIN_INFO = {
    'email': 'user1',
    'pwd': '1'
}

# # Session 생성, with 구문 안에서 유지
# with requests.Session() as s:
#     # HTTP POST request: 로그인을 위해 POST url와 함께 전송될 data를 넣어주자.
#     login_req = s.post('http://localhost:3000/auth/login', data=LOGIN_INFO)
#     # 어떤 결과가 나올까요?
#     print(login_req.status_code)

with requests.Session() as s:
   
    res = s.post(url+'auth/login_process', data=LOGIN_INFO)
    #print(res.text)

    #response = s.get(url)
    html = s.get(url+'topic/owner')
    #print(html.text)

    soup = bs(html.text, features ='html.parser')
    #print(soup)
    aforms=soup.find_all('form', attrs={'action' : '/topic/owner_process'})
    #print(aform)
    REQC = []
    for aform in aforms:
        a = aform.find_all('input', attrs={'name':'requestContractAddress'})[0]
        REQC.append(a['value'])
        #print(a['value'])
    print(REQC)
    request_INFO={
        'requestContractAddress':REQC[0]
    }
    res = s.post(url+'topic/owner_yes')#, data=request_INFO)
    print(res.text)
    