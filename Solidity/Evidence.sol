pragma solidity ^0.5.1;
import "./Search.sol";

contract Evidence{
    address public owner;
    string public frame_hash;
    int public time;
    int public location;
    bool public isVerified;
   // address cloud = 0x0C8f9DFe4fCDBaB8dAa6d8e08b661C7C35b44b5d;
    address cloud = 0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c;
    
    function setEvidence(string memory _frame_hash, int _time, int _location) public payable{
        owner = msg.sender;
        frame_hash = _frame_hash;
        time = _time;
        location = _location;
        isVerified = false;
    }
    function getOwner() public view returns(address _owner){
        return (owner);
    }
    function getData() public view returns(string memory _frame_hash, int _time, int _location, bool _isVerified){
        return ( frame_hash, time, location, isVerified);
    }
    function verify(Search s) public{
        if(msg.sender == cloud){
            isVerified= true;
            s.setEvidence(address(this), time, location);
        }
    }
}
