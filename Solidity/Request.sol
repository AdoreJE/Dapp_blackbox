pragma solidity ^0.5.1;
import "./Evidence.sol";
import "./Response.sol";

contract Request{
    Evidence evid;
    
    address requester;
    int rekey;
    int link;
    
    
    int puk;
    address evidAddr;    
    
    constructor() public{
        requester = msg.sender;
    }
    
    function requestVideo(Response REP, address _evidAddr, int _puk) public{
        puk = _puk;
        evidAddr=_evidAddr;
        evid = Evidence(evidAddr);
        REP.set(address(this), _evidAddr);
    }
    
    function setData(int _rekey, int _link) public{
        if (msg.sender == evid.getOwner()){
            rekey = _rekey;
            link = _link;
        }
    }
    function getReKey() public view returns(int _rekey, int _link){
        if(msg.sender == requester){
            return (rekey, link);
        }
    }
    function getData() public view returns(address _evidAddr,int _puk){
        return (evidAddr, puk);
    }
    
}

