import React, { useState } from 'react';
import './App.css';
import * as KlipAPI from './api/UseKlip'
import QRCode from 'qrcode.react';

import { getBalanceReact, readTokens } from './api/UseCaver'

const DEFAULT_QR_CODE = "DEFAULT";


function App() {

  const [qrvalue, setQrvalue] = useState(DEFAULT_QR_CODE);
  const [address, setAddress] = useState('no address');
  
    
  const onClickGetAddress = () => {
    KlipAPI.getAddress(setAddress, setQrvalue);
    alert('get address');
  }

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
    KlipAPI.enrollTrademark(addressval,input1val,input2val,setQrvalue);
    alert('등록');
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>상표 임시 등록 서비스 (증명 자료 제출시 사용)</h1>
        <button 
          title="get EnrolledTokens" 
          color="#ff5c5c" 
          onClick={onClickGetEnrolledTokens} 
        >
          getEnrolledTokens
        </button> 

        <p id="address">
          {address}
        </p>
        
        <br />
        <label for="input1">등록번호 입력</label>
        <input
          id="input1"
          type="text"
        />

        <label for="input2">상표 이름 입력</label>
        <input
          id="input2"
          type="text"
        />
        

        <br />
        <button 
          title="get contract" 
          color="#ff5c5c" 
          onClick={onClickGetContract} 
        >
          Get Contract
        </button>
        <br />
       
        <QRCode value={qrvalue} />

        <button 
          title="get address" 
          color="#ff5c5c" 
          onClick={onClickGetAddress} 
        >
          Get Address
        </button>

        <button onClick={onClickEnrollTrademark}>상표 임시 등록</button>
        
      </header>
    </div>

    
  );
}

export default App;
