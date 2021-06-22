import React, { useState } from 'react'; // Clean Save !! // Clean Save !!
import './App.css';
import './marklog.css'
import * as KlipAPI from './api/UseKlip'
import QRCode from 'qrcode.react';
import "bootstrap/dist/css/bootstrap.min.css";

import * as CaverAPI from './api/UseCaver'
// import { getLogsAll, getBalanceReact, readTokens } from ''
import { Alert, Card, Container } from 'react-bootstrap';

const DEFAULT_QR_CODE = "DEFAULT";

const DEFAULT_ADDRESS = '0x0000';


function App() {
  // State data
  // Global data(domain data)
  // 1. address -> usestate
  const [myAddress, setMyAddress] = useState(DEFAULT_ADDRESS);

  // 2. nft
  const [nfts, setNfts] = useState([{tokenId:100,tokenUri:"101"}]); // [{tokenId: integer, tokenUri: string},...]


  // tab ui
  // min input
  // modal

  // balance
  const [myBalance, setMyBalance] = useState('0');


  // on click mint
  // on click my card
  // on click market card

  const [qrvalue, setQrvalue] = useState(DEFAULT_QR_CODE);
  const [address, setAddress] = useState('no address');

  // fetch market nft
  // fetch my nfts
  const fetchMyNFTs = () => {
    // [{tokenId:100, tokenUri: ".png"},...]
    // 3 fn :  
    //  balanceOf => 소유 NFT 토큰 개수, 
    //  tokenOfOwnerByIndex => 인덱스별 토큰ID => 배열로 만들기, 
    //  tokenURI => 토큰아이디에 대한 URI정보 가져오기
    
  }
  console.log("test!");
  console.log(typeof process.env.REACT_APP_KAS_ACCESS_KEY_ID);
  console.log(process.env.REACT_APP_KAS_ACCESS_KEY_ID);
  console.log(process.env.REACT_APP_VERSION);
  
  // get user data
  const getUserData = () => {
    // 자기 주소, 자기 클레이 잔고
    KlipAPI.getAddress(setQrvalue, async (address) => {
      setMyAddress(address);
      const _balance = await CaverAPI.getBalanceReact(address);
      setMyBalance(_balance);
      alert('get address');
    });
  }


  const onClickGetContract = () => {
    KlipAPI.getContract(setQrvalue);
    alert('get contract');
  }

  const onClickGetEnrolledTokens = () => {
    KlipAPI.getEnrolledTokens(setQrvalue);
    alert('get tokens');
    CaverAPI.readTokens();
  }

  const onClickEnrollTrademark = () => {
    // const addressval = document.getElementById('address').innerText;
    // const addressval = myAddress;
    const input1val = document.getElementById('input1').value;
    const input2val = document.getElementById('input2').value;
    KlipAPI.enrollTrademark(myAddress, input1val, input2val, setQrvalue);
    alert('등록');
  }


  const test = CaverAPI.readTokens().then((s)=>{
    console.log('test token');
    console.log(s);
    console.log(typeof s);
    // setNfts(s);
    // const arr = s.map((e)=>{
    //   console.log('e');
    //   console.log(e);
    //   console.log(e.tokenId);
    //   console.log(e.tokenUri);
    // });
    // console.log(arr);
  });

  const getAllTokens = async () => {
    const _tokens = await CaverAPI.readTokens();
    console.log("_tokens");
    console.log(_tokens);
    setNfts(_tokens);
    // alert('get tokens');
  }


  // console.log('test');
  // console.log(test);

    
  // const test1 = KlipAPI.getEnrolledTokens(setQrvalue);
  // console.log('test kas');
  // console.log(test1);


  console.log('test log');
  const test2 = CaverAPI.getLogsAll(0);
  console.log(test2);

  return (
    <div className="App">
      <div style={{ backgroundColor: '#FAEBEF', padding: 10 }}>
        <p>env</p>
        <pre>{process.env.REACT_APP_KAS_ACCESS_KEY_ID}</pre>

        <div 
          style={{ 
            fontSize: 30, 
            fontWeight: 'bold', 
            paddingLeft: 5, 
            marginTop: 10 
          }}
        >
          내 지갑
        </div>
        <p>주소 : {myAddress}</p>
        {process.env.NODE_ENV}
        <em>%REACT_APP_KAS_ACCESS_KEY_ID%</em>
        <br />
        <Alert
          variant={'balance'}
          style={{ backgroundColor: '#333D79', fontSize: 25 }}>
          <p>잔고 : {myBalance}</p>
        </Alert>
        
        
        

      </div>
      {/* #FAEBEF */}
      {/* 주소 잔고 */}
      <button
        title="get userdata"
        color="#ff5c5c"
        onClick={getUserData}
      >get userdata</button>
      <br />
      <br />

      <button 
        title="getAllTokens" 
        color="#ff5c5c" 
        onClick={getAllTokens} 
      >
        getAllTokens
      </button> 
      리스트
      {/* {nfts} */}
      {/* {nfts.map(e=>(<h1>{e.tokenId}</h1>))} */}
      <ul>
      {[...nfts].map((nft,index)=>(
        <li key={nft+index}>
          {nft.tokenId}:{nft.tokenUri}
        </li>
      ))}
      </ul>
      {/* <div>
        {nfts}
      </div> */}

      <Container style={{ backgroundColor: 'white', width: 300, padding: 20 }}>
        <QRCode value={qrvalue} size={256} style={{ margin: 'auto' }} />
      </Container>

      {/* 갤러리(마켓, 내 지갑 공유하는 ui) */}
      <Container style={{padding:0,width:"100%", height:"100px"}}>

      </Container>
      {/* 발행페이지 */}
      {/* 탭 */}
      {/* 모달 */}

    </div>


  );
}

export default App;
