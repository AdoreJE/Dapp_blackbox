pragma solidity ^0.5.1;


contract Search{
    int keyIndex=0;
    struct Searching{
        int time;
        int location;
    }
  
    address[] Addrs;
    mapping(address=>Searching) SearchingEvidence;
    
    //검색을 위한 정보 설정
    function setSearching(address _EvidAddress, int _time, int _location) internal {
        SearchingEvidence[_EvidAddress] = Searching(_time, _location);
        Addrs.push(_EvidAddress);
    }
    
    function getData(address _EvidAddress) public view returns(int, int){
        return (SearchingEvidence[_EvidAddress].time, SearchingEvidence[_EvidAddress].location);
    }
    
  
    function getAddress() public view returns(address[] memory){
        return Addrs;
    }

    
    //블랙박스에서 Evidence가 발행되면 실행됨.
    function setEvidence(address _EvidAddress, int _time, int _location) external {
        Addrs.push(_EvidAddress);
        setSearching(_EvidAddress, _time, _location);
    }
}
