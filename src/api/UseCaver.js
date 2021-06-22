import Caver from 'caver-js';
// import * as count_abi from '../abi/count_abi.json';
import * as log_trademark from '../abi/cypressContract.json';

// 1. Smart Contract 배포 주소 파악(가져오기)
// 2. caver-js 이용해서 스마트 컨트랙트 연동하기
// 3. 가져온 스마트 컨트랙트 실행 결과(데이터) 웹에 표현하기
const CONTRACT_ADDRESS = process.env.REACT_APP_MARKLOG_CYPRESS_CONTRACT_ADDRESS;

const option = {
  headers: [
    {
      name: "Authorization",
      // value: "Basic " + Buffer.from( "access key" + "secret key")
      value: "Basic " + Buffer.from( process.env.REACT_APP_KAS_ACCESS_KEY_ID + ":"+ process.env.REACT_APP_KAS_SECRET_ACCESS_KEY).toString("base64")
    },
    {
      // name: "x-chain-id", value: "chainid"
      // name: "x-chain-id", value: process.env.REACT_APP_MAINNET_CHAIN_ID // main
      name: "x-chain-id", value: process.env.REACT_APP_MAINNET_CHAIN_ID // test
    }
  ]
}

const caver = new Caver(new Caver.providers.HttpProvider("https://node-api.klaytnapi.com/v1/klaytn",option));

const MarkLogContract = new caver.contract(log_trademark.default, CONTRACT_ADDRESS);

export const readTokens = async () => {
    const _tks = await MarkLogContract.methods.enrolledTokens().call();
    // console.log("readTokens=>");
    // console.log(..._tks);
    const _objArr = [];
    const _arr = [..._tks].map(async (e,i)=> {
      const uri = await _tokenURIsFn(e);
      _objArr.push({tokenId:e, tokenUri: uri});
      // const uri = _tokenURIsFn(e).then((s)=>{
      //   _objArr.push({tokenId:e, tokenUri: s});
      // });
    });
    // console.log("_arr");
    // console.log(_arr);   
    // console.log("_objArr");
    // console.log(_objArr);
    return _objArr;
}

export const getLogsAll = async (_tokenId) => {
  try {
    const _tarr = await MarkLogContract.methods.getLogTimes(_tokenId).call();
    const _larr = [];
    // const _length = _arr.length;
    // [...Array(_length)].map((e, i) => )
    
    _tarr.map((el, idx) => {
      const _elem = _getLogFn(_tokenId,idx);
      _larr.push(_elem);
    });

    console.log("getLogs=>");
    console.log(_tarr);
    console.log(_larr);

  } catch (e) {
    throw Error(e);
  }
}

const _getLogFn = async (_tokenId, _index) => {
  try {
    const _res = await MarkLogContract.methods.getLog(_tokenId,_index).call();
    return _res;
  } catch (e) {
    throw Error(e);
  }
}


// ownedTokens (address) => 소유자의 토큰들 가져오는 함수 (promise 라서 then으로 풀어야함.)

// tokenOwner (uint256) => 토큰 소유자 반환  (promise 라서 then으로 풀어야함.)

// tokenURIs (uint256) => 토큰의 설명 반환  (promise 라서 then으로 풀어야함.)
const _tokenURIsFn = async (_tokenId) => {
  try{
    const _res = await MarkLogContract.methods.tokenURIs(_tokenId).call();
    return _res;
  } catch (e) {
    throw Error(e);
  }
}

export const getBalanceReact = (address) => {
    return caver.rpc.klay.getBalance(address).then((response)=>{
      const balance = caver.utils.convertFromPeb(caver.utils.hexToNumberString(response));
      console.log(`BALANCE : ${balance}`);
      return balance;
    });

}
