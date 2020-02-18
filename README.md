# Dapp_blackbox
이더리움 기반의 블랙박스 영상 공유 플랫폼
딥러닝을 통해 다른 차량의 사고를 목격한 영상을 판별하며 블록체인을 이용하여 영상을 공유한다.
영상의 메타데이터가 블록체인에 저장되기 때문에 조작된 영상을 공유할 수 없으며
익명으로 영상을 요청하고 공유받을 수 있다.

## Prerequisites
* geth
* solidity
* nodejs
* python

## Directory structure
* Cloud
** web_service
    Dapp_blackbox의 메인 웹 구현
블랙박스로부터 전송된 암호화된 영상을 저장
이더리움 네트워크와 통신

* Constant
스마트컨트랙트 ABI, data 저장

* Dashcam
딥러닝을 통해 사고 영상을 판별
판별된 영상을 암호화하여 클라우드로 전송

* Owner
영상 소유자의 개인키, 공개키 생성
웹을 통해 클라우드와 통신하며 영상 공유

* Requester
영상 요청자의 개인키, 공개키 생성
웹을 통해 클라우드와 통신하며 영상 공유

* Solidity
스마트 컨트랙트 