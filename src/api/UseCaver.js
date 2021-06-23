import Caver from 'caver-js';
import * as log_trademark from '../abi/marklogContractAbi.json';

/**
 * 
 * use "find"
 * let abiFn = log_trademark.default.find( fns => fns.name === "something" );
 * 
 * "enrolledTokens"
 * 
 * "registerMarkInfo"
 * "tokenInfoMap"
 * "setMarkInfo"
 * "getMarkInfo"
 * 
 * "logTrademark"
 * "getLogTimes"
 * "getLog"
 * 
 * "ownedTokens"
 * "tokenOwner"
 * 
 * "safeTransferFrom" (사용 계획 미정)
 * 
 */

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

const _objArr = [];

export const readTokens = async () => {
    console.log("_objArr1");
    console.log(_objArr);
    const _tks = await MarkLogContract.methods.enrolledTokens().call();
    // const _tks = await enrolledTokens();
    console.log("readTokens=>");
    console.log(typeof _tks);
    // if(_objArr.length === _tks.length){}

    _tks.map( async (e,i)=> {
      console.log('check');
      const info = await _getMarkInfo(e);
      if(_objArr.length < _tks.length){
        _objArr.push({ tokenId:e, tokenInfo: info });
      }
      // const uri = _tokenURIsFn(e).then((s)=>{
      //   _objArr.push({tokenId:e, tokenUri: s});
      // });
    });
  
    // console.log("_arr");
    // console.log(_arr);   
    console.log("_objArr2");
    console.log(_objArr);
    return _objArr;
}


export const readAllTokens = async (_tks) => {
  _tks.map(async (e,i)=> {
    console.log('check');
    const info = await _getMarkInfo(e);
    _objArr.push({ tokenId:e, tokenInfo: info });
    // const uri = _tokenURIsFn(e).then((s)=>{
    //   _objArr.push({tokenId:e, tokenUri: s});
    // });
  });

  // console.log("_arr");
  // console.log(_arr);   
  console.log("_objArr2");
  console.log(_objArr);
  return _objArr;
}

export const enrolledTokens = async () => {
  const _tks = await MarkLogContract.methods.enrolledTokens().call();
  return _tks;
}

export const getLogsAll = async (_tokenId) => {
  try {
    // timestamp[] <- function
    const _tarr = await MarkLogContract.methods.getLogTimes(_tokenId).call();
    const _larr = [];
    // const _length = _arr.length;
    // [...Array(_length)].map((e, i) => )
    
    // timestamp[] loop
    _tarr.map(async (el, idx) => {
      const _elem = await _getLogFn(_tokenId,idx);
      
      // _elem: log, el: timestamp
      _larr.push({ contents:_elem, timestamp:el });
    });

    console.log("getLogs=>");
    console.log(_tarr);
    console.log(_larr);
    return _larr;

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
// LOG 화면에서 쓸 함수
const _ownedTokensFn = async (_address) => {
  try{
    const _res = await MarkLogContract.methods.ownedTokens(_address).call();
    return _res;
  } catch (e) {
    throw Error(e);
  }
}


// tokenOwner (uint256) => 토큰 소유자 반환  (promise 라서 then으로 풀어야함.)
// SEARCH 화면에서 쓸 함수

// tokenURIs (uint256) => 토큰의 설명 반환  (promise 라서 then으로 풀어야함.)
const _getMarkInfo = async (_tokenId) => {
  try{
    const _res = await MarkLogContract.methods.getMarkInfo(_tokenId).call();
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
