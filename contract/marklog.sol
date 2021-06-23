// Klaytn IDE uses solidity 0.4.24, 0.5.6 versions.
pragma solidity >=0.4.24 <=0.5.6;

contract MyTrademark {
    string public name = "LogTrademark";
    string public symbol = "KL";
    
    struct tokenInfo {
        string title;
        string tokenUri;
        string description;
        uint256 category;
        uint256 sector;
    }
    
    mapping(uint256 => address) public tokenOwner;
    mapping(uint256 => tokenInfo) public tokenInfoMap;
    mapping(uint256 => uint256[]) private _timestamps;
    mapping(uint256 => string[]) private _logs;
    
    uint256[] private _enrolledTokens;
    
    mapping(address => uint256[]) private _ownedTokens;
    bytes4 private constant _KIP17_RECEIVED = 0x6745782b;
        
    function registerMarkInfo(
        address to, uint256 tokenId, string memory title, 
        string memory tokenUri, string memory description, 
        uint256 category, uint256 sector
    ) public returns (bool) {
        require(to == msg.sender, "from != msg.sender");
        require(
            tokenOwner[tokenId] == 0x0000000000000000000000000000000000000000,
            "enrolled ID!"
        );

        tokenOwner[tokenId] = to;
        
        tokenInfo storage newToken = tokenInfoMap[tokenId];
        newToken.title = title;
        newToken.tokenUri = tokenUri;
        newToken.description = description;
        newToken.category = category;
        newToken.sector = sector;
        _enrolledTokens.push(tokenId);
        
        // add token to the list
        _ownedTokens[to].push(tokenId);
    
        uint256 _tempNow = now;
        _timestamps[tokenId].push(_tempNow); // 0: uint256: 1621905998
        _logs[tokenId].push("Trace your first use log!");
        
        return true;
    }
    
    function getMarkInfo(
        uint256 tokenId
    ) public view returns (string memory, string memory, string memory,uint256,uint256){
        tokenInfo storage s = tokenInfoMap[tokenId];
        return (s.title,s.tokenUri,s.description,s.category,s.sector);
    }
    
    function setMarkInfo(
        address from, uint256 tokenId, string memory title, 
        string memory tokenUri, string memory description, 
        uint256 category, uint256 sector
    ) public returns (bool) {
        require(from == msg.sender, "from != msg.sender");
        require(
            from == tokenOwner[tokenId],
            "you are not the owner of the token"
        );
        
        tokenInfo storage s = tokenInfoMap[tokenId];
        s.title = title;
        s.tokenUri = tokenUri;
        s.description = description;
        s.category = category;
        s.sector = sector;
        
        return true;
    }

    function logTrademark(
        address from,
        uint256 tokenId,
        string memory logData
    ) public { 
        bytes memory _tempLog = bytes(_logs[tokenId][0]); // Uses memory
    
        require(from == msg.sender, "from != msg.sender");
        require(
            from == tokenOwner[tokenId],
            "you are not the owner of the token"
        );
        require(
            // _tempLog.length == 25,
            _tempLog.length != 0,
            // firstlog != 0,
            "first log error!"
        );

        _logs[tokenId].push(logData);
        _timestamps[tokenId].push(now);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) public {
        require(from == msg.sender, "from != msg.sender");
        require(
            from == tokenOwner[tokenId],
            "you are not the owner of the token"
        );

        _removeTokenFromList(from, tokenId);
        _ownedTokens[to].push(tokenId);

        tokenOwner[tokenId] = to;

        require(
            _checkOnKIP17Received(from, to, tokenId, _data),
            "KIP17: transfer to non KIP17Receiver implementer"
        );
    }

    function _removeTokenFromList(address from, uint256 tokenId) private {
        uint256 lastTokenIndex = _ownedTokens[from].length - 1;
        for (uint256 i = 0; i < _ownedTokens[from].length; i++) {
            if (tokenId == _ownedTokens[from][i]) {
                // Swap last token with deleting token;
                _ownedTokens[from][i] = _ownedTokens[from][lastTokenIndex];
                _ownedTokens[from][lastTokenIndex] = tokenId;
                break;
            }
        }
        _ownedTokens[from].length--;
    }

    function ownedTokens(address owner) public view returns (uint256[] memory) {
        return _ownedTokens[owner];
    }
    
    function enrolledTokens() public view returns (uint256[] memory) {
        return _enrolledTokens;
    }
    
    function getLogTimes(uint256 tokenId) public view returns (uint256[] memory) {
        return _timestamps[tokenId];
    }

    
    function getLog(uint256 tokenId, uint256 index) public view returns (string memory) {
        return _logs[tokenId][index];
    }

    function _checkOnKIP17Received(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) internal returns (bool) {
        bool success;
        bytes memory returndata;

        if (!isContract(to)) {
            return true;
        }

        (success, returndata) = to.call(
            abi.encodeWithSelector(
                _KIP17_RECEIVED,
                msg.sender,
                from,
                tokenId,
                _data
            )
        );
        if (
            returndata.length != 0 &&
            abi.decode(returndata, (bytes4)) == _KIP17_RECEIVED
        ) {
            return true;
        }

        return false;
    }

    function isContract(address account) internal view returns (bool) {
        // This method relies in extcodesize, which returns 0 for contracts in
        // construction, since the code is only stored at the end of the
        // constructor execution.

        uint256 size;
        // solhint-disable-next-line no-inline-assembly
        assembly {
            size := extcodesize(account)
        }
        return size > 0;
    }
}

contract TrademarkDeal {
    mapping(uint256 => address[]) public seller;
    
    function buyNFT(uint256 tokenId, address NFT)
        public
        payable
        returns (bool)
    {
        uint256 _lastSellerIndex = seller[tokenId].length - 1;
        address payable receiver = address(uint160(seller[tokenId][_lastSellerIndex]));

        // Send 0.01 klay to Seller
        receiver.transfer(10**16);

        // Send NFT if properly send klay
        MyTrademark(NFT).safeTransferFrom(
            address(this),
            msg.sender,
            tokenId,
            "0x00"
        );

        return true;
    }

    // Called when SafeTransferFrom called from NFT Contract
    function onKIP17Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes memory data
    ) public returns (bytes4) {
        // Set token seller, who was a token owner
        seller[tokenId].push(from);

        // return signature which means this contract implemented interface for ERC721
        return
            bytes4(keccak256("onKIP17Received(address,address,uint256,bytes)"));
    }
}
