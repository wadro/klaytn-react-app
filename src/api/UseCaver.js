import Caver from 'caver-js';
// import * as count_abi from '../abi/count_abi.json';
import * as log_trademark from '../abi/log_trademark.json';

// 1. Smart Contract 배포 주소 파악(가져오기)
// 2. caver-js 이용해서 스마트 컨트랙트 연동하기
// 3. 가져온 스마트 컨트랙트 실행 결과(데이터) 웹에 표현하기

const option = {
  headers: [
    {
      name: "Authorization",
      // value: "Basic " + Buffer.from( "access key" + "secret key")
      value: "Basic " + Buffer.from( process.env.REACT_APP_KAS_ACCESS_KEY_ID + ":"+ process.env.REACT_APP_KAS_SECRET_ACCESS_KEY).toString("base64")
    },
    {
      // name: "x-chain-id", value: "chainid"
      name: "x-chain-id", value: process.env.REACT_APP_MAINNET_CHAIN_ID
    }
  ]
}

const caver = new Caver(new Caver.providers.HttpProvider("https://node-api.klaytnapi.com/v1/klaytn",option));

const MarkLogContract = new caver.contract(log_trademark.default, process.env.REACT_APP_MARKLOG_CONTRACT_ADDRESS);

export const readTokens = async () => {
  const _tks = await MarkLogContract.methods.enrolledTokens().call();
  console.log(_tks);
}

export const getBalanceReact = (address) => {
  return caver.rpc.klay.getBalance(address).then((response)=>{
    const balance = caver.utils.convertFromPeb(caver.utils.hexToNumberString(response));
    console.log(`BALANCE : ${balance}`);
    return balance;
  });
}
