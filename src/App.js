import React, { useState } from 'react'; // Clean Save !! // Clean Save !!
import './App.css';
import './logmark.css'
import * as KlipAPI from './api/UseKlip'
import QRCode from 'qrcode.react';
import "bootstrap/dist/css/bootstrap.min.css";

import { getBalanceReact, readTokens } from './api/UseCaver'
import { Alert, Container } from 'react-bootstrap';

const DEFAULT_QR_CODE = "DEFAULT";

const DEFAULT_ADDRESS = '0x0000';


function App() {
  // State data
  // Global data(domain data)
  // 1. address -> usestate
  const [myAddress, setMyAddress] = useState(DEFAULT_ADDRESS);

  // 2. nft
  const [nfts, setNfts] = useState([]);

  // tab ui
  // min input
  // modal

  // balance
  const [myBalance, setMyBalance] = useState('0');

  // fetch market nft
  // fetch my nfts
  // on click mint
  // on click my card
  // on click market card

  // get user data
  const getUserData = () => {
    // 자기 주소, 자기 클레이 잔고
    KlipAPI.getAddress(setQrvalue, async (address) => {
      setMyAddress(address);
      const _balance = await getBalanceReact(address);
      setMyBalance(_balance);
      alert('get address');
    });

  }

  const [qrvalue, setQrvalue] = useState(DEFAULT_QR_CODE);
  const [address, setAddress] = useState('no address');


  const onClickGetContract = () => {
    KlipAPI.getContract(setQrvalue);
    alert('get contract');
  }

  const onClickGetEnrolledTokens = () => {
    KlipAPI.getEnrolledTokens(setQrvalue);
    alert('get tokens');
    readTokens();
  }

  const onClickEnrollTrademark = () => {
    const addressval = document.getElementById('address').innerText;
    const input1val = document.getElementById('input1').value;
    const input2val = document.getElementById('input2').value;
    KlipAPI.enrollTrademark(addressval, input1val, input2val, setQrvalue);
    alert('등록');
  }

  return (
    <div className="App">
      <div style={{ backgroundColor: '#FAEBEF', padding: 10 }}>
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

      <div>

      </div>

      <Container style={{ backgroundColor: 'white', width: 300, padding: 20 }}>
        <QRCode value={qrvalue} size={256} style={{ margin: 'auto' }} />
      </Container>


      {/* 갤러리(마켓, 내 지갑 공유하는 ui) */}
      {/* 발행페이지 */}
      {/* 탭 */}
      {/* 모달 */}

    </div>


  );
}

export default App;
