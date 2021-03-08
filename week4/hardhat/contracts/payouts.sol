/** This example code is designed to quickly deploy an example contract using Remix.
 *  If you have never used Remix, try our example walkthrough: https://docs.chain.link/docs/example-walkthrough
 *  You will need testnet ETH and LINK.
 *     - Kovan ETH faucet: https://faucet.kovan.network/
 *     - Kovan LINK faucet: https://kovan.chain.link/
 */
// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.6.0;

import "https://raw.githubusercontent.com/smartcontractkit/chainlink/develop/evm-contracts/src/v0.6/ChainlinkClient.sol";

contract payouts is ChainlinkClient {
  
    uint256 public volume;
    
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;
    address[] activeAddr;
    mapping (address => uint256[]) userLocation;
    
    /**
     * Network: Kovan
     * Chainlink - 0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e
     * Chainlink - 29fa9aa13bf1468788b7cc4a500a45b8
     * Fee: 0.1 LINK
     */
    constructor() public {
        setPublicChainlinkToken();
        activeAddr = [0x07E032C79B7cb48dF619755426b13199FD5f8770];
        userLocation[0x07E032C79B7cb48dF619755426b13199FD5f8770] = [2247,8836];
        oracle = 0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e;
        jobId = "29fa9aa13bf1468788b7cc4a500a45b8";
        fee = 0.1 * 10 ** 18; // 0.1 LINK
    }
    
    // function requestVolumeData() public returns (bytes32 requestId) 
    // {
    //     Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
    //     request.add("get", "https://insurancesoln.herokuapp.com/cyclone_prob?lat=22.47&lon=88.36");
    //     request.add("path", "premium");
    //     return sendChainlinkRequestTo(oracle, request, fee);
    // }
    
    
    function uint2str(uint256 _i) internal pure returns (string memory _uintAsString) 
    {
        if (_i == 0) {
        return "0";}
        uint j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len - 1;
        while (_i != 0) {
            bstr[k--] = byte(uint8(48 + _i % 10));
            _i /= 10;
        }
        return string(bstr);
    }
    
    function append(string memory a, string memory b, string memory c, string memory d) internal pure returns (string memory) {

        return string(abi.encodePacked(a, b, c, d));
    
    }

    
    /** 
     * check if eligibly for payout
     */
     function checkpayout() public returns (bytes32 requestId){
         uint j=0;
         for (j = 0; j < activeAddr.length; j++) { 
            uint256 lat = userLocation[activeAddr[j]][0];  
            uint256 lon = userLocation[activeAddr[j]][1];
            string memory lat_str = uint2str(lat);
            string memory lon_str = uint2str(lon);
            string memory domain = "https://insurancesoln.herokuapp.com/check_payout?lat=";
            string memory filler = "&lon=";
            string memory s = append(domain,lat_str,filler,lon_str);
            Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
            request.add("get", s);
            request.add("path", "tornado");
            return sendChainlinkRequestTo(oracle, request, fee);
        }
     }
     
     /**
     * Receive the response in the form of uint256
     */ 
    function fulfill(bytes32 _requestId, uint256 _volume) public recordChainlinkFulfillment(_requestId)
    {
        volume = _volume;
    }
    
    function withdrawLink() external {
        LinkTokenInterface linkToken = LinkTokenInterface(chainlinkTokenAddress());
        require(linkToken.transfer(msg.sender, linkToken.balanceOf(address(this))), "Unable to transfer");
    }
}
