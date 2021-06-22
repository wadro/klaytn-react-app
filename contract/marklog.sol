// Maze Found | Read the Docs (remix.readthedocs.io)
// Klaytn IDE uses solidity 0.4.24, 0.5.6 versions.
pragma solidity >=0.4.24 <=0.5.6;
// pragma solidity ^0.8.2;
// pragma abicoder v2;
// pragma experimental ABIEncoderV2;

contract MyTrademark {
    string public name = "LogTrademark";
    string public symbol = "KL";

    mapping(uint256 => address) public tokenOwner;
    mapping(uint256 => string) public tokenURIs;
    
    mapping(uint256 => uint256[]) private _timestamps;
    // block.timestamp;
    // now;
    
    // 시간에 매핑된 기록
    mapping(uint256 => string[]) private _logs;
    
    uint256[] private _enrolledTokens;
    
    
    // 소유한 토큰 리스트
    mapping(address => uint256[]) private _ownedTokens;
    bytes4 private constant _KIP17_RECEIVED = 0x6745782b;

    // mint(tokenId, uri, owner)
    // transferFrom(from, to, tokenId) -> owner가 바뀌는 것(from -> to)

    
    // function append(string memory a, string memory b) internal pure returns (string memory) {
    //     return string(abi.encodePacked(a, b));
    // }
    
    // function uintToString(uint v) constant returns (string str) {
    //     uint maxlength = 100;
    //     bytes memory reversed = new bytes(maxlength);
    //     uint i = 0;
    //     while (v != 0) {
    //         uint remainder = v % 10;
    //         v = v / 10;
    //         reversed[i++] = byte(48 + remainder);
    //     }
    //     bytes memory s = new bytes(i + 1);
    //     for (uint j = 0; j <= i; j++) {
    //         s[j] = reversed[i - j];
    //     }
    //     str = string(s);
    // }

    
    function mintWithTokenURI(
        address to,
        uint256 tokenId,
        string memory tokenURI
    ) public returns (bool) {
        bytes memory _tempUri = bytes(tokenURIs[tokenId]); // Uses memory
    
        require(to == msg.sender, "from != msg.sender");
        require(
            _tempUri.length == 0,
            "already enrolled token"
        );
        // to에게 tokenId(일련번호)를 발행하겠다.
        // 적힐 글자는 tokenURI
        tokenOwner[tokenId] = to;
        tokenURIs[tokenId] = tokenURI;
        
        uint256 _tempNow = now;
        
        // 생성 시간 기록
        // timestamps[tokenId] = block.timestamp; // 0: uint256: 1621905865
        _timestamps[tokenId].push(_tempNow); // 0: uint256: 1621905998
        
        // 사용 로그 기록
        
        _logs[tokenId].push("Trace your first use log!");
        
        // add token to the list
        _ownedTokens[to].push(tokenId);
        
        _enrolledTokens.push(tokenId);

        return true;
    }
    
    function logTrademark(
        address from,
        uint256 tokenId,
        string memory logData
    ) public { 
        // uint256 firstTime = getLogTimes(tokenId)[0];
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
        
        // 사용한 시간 순서로 인덱스로 기록(첫번째 사용기록은 1부터 시작, 0은 처음 등록했을때의 기록)

        // push new log data (상표 사용 기록)
        // uint256 _tempNow = now;
        
        _logs[tokenId].push(logData);
        
        // 상표 사용 기록의 내용과 함께 시간 기록
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
        //
        _removeTokenFromList(from, tokenId);
        _ownedTokens[to].push(tokenId);
        //
        tokenOwner[tokenId] = to;
        //
        require(
            _checkOnKIP17Received(from, to, tokenId, _data),
            "KIP17: transfer to non KIP17Receiver implementer"
        );
    }

    function _removeTokenFromList(address from, uint256 tokenId) private {
        // [10, 15, 19, 20] -> 19번을 삭제 하고 싶어요
        // [20, 15, 20, 19]
        // [10, 15, 20]
        uint256 lastTokenIndex = _ownedTokens[from].length - 1;
        for (uint256 i = 0; i < _ownedTokens[from].length; i++) {
            if (tokenId == _ownedTokens[from][i]) {
                // Swap last token with deleting token;
                _ownedTokens[from][i] = _ownedTokens[from][lastTokenIndex];
                _ownedTokens[from][lastTokenIndex] = tokenId;
                break;
            }
        }
        //
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
    
    // function getLogsAll(uint256 tokenId) public view returns (string[] memory) {
    //     return _logs[tokenId];
    // }
    
    function getLog(uint256 tokenId, uint256 index) public view returns (string memory) {
        return _logs[tokenId][index];
    }

    function setTokenUri(address from, uint256 tokenId, string memory tokenURI) public {
        require(from == msg.sender, "from != msg.sender");
        require(
            from == tokenOwner[tokenId],
            "you are not the owner of the token"
        );
        tokenURIs[tokenId] = tokenURI;
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
    
    // buy 대신에 기록하는 함수 필요함.
    
    // 상표 buy, sell은 따로 계약 후에 소유자를 바꾸는 과정 필요함.
    
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
