pragma solidity ^0.5.1;
import "./Evidence.sol";

contract Response{
    struct A{
        address[] requesterAddrs;
        mapping(address=>address) evidAddr;
    }
    
    mapping(address => A) REQC;
 
    function set(address _requesterAddr, address _evidAddr) public{
        Evidence evid = Evidence(_evidAddr);
        address owner = evid.getOwner();
        REQC[owner].requesterAddrs.push(_requesterAddr);
        uint len = REQC[owner].requesterAddrs.length;
        REQC[owner].evidAddr[REQC[owner].requesterAddrs[len-1]] = _evidAddr;
    }
    
    function get() public view returns(address[] memory _requesterAddr) {
        return REQC[msg.sender].requesterAddrs;
    }

}
