import React, { useEffect, useState } from 'react';
import './App.css';
import './marklog.css'
import Fuse from 'fuse.js';
import * as KlipAPI from './api/UseKlip'
import * as CaverAPI from './api/UseCaver'
import QRCode from 'qrcode.react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form, Alert, Card, Container, Nav } from 'react-bootstrap';
// import { getLogsAll, getBalanceReact, readTokens } from ''


const DEFAULT_QR_CODE = "DEFAULT";
const DEFAULT_ADDRESS = '0x0000000000000000000000000000000000000000';

// console.log(Fuse);
const characters = [
  {  
    title: "one",
    tokenUri: "https://cdn.pixabay.com/photo/2014/09/07/15/31/number-437919_960_720.jpg",
    description: "number test 1",
    category: 100,
    sector: 1000
  },
  {  
    title: "two",
    tokenUri: "https://cdn.pixabay.com/photo/2014/09/07/15/31/number-437918_960_720.jpg",
    description: "number test 2",
    category: 100,
    sector: 1000
  }
]


function App() {

  const fuse = new Fuse((characters), {
    keys: [
      'title',
      'tokenUri',
      'description'
    ],
    shouldSort: true,
    location: 0,
    distance: 1000,
    threshold: 1,
    minMatchCharLength: 2,
    includeScore: true
  
  });
  // const results = fuse.search('two');
  // const characterResults = results.map(character => character.item);

 
  const [query, updateQuery] = useState('');


  // State data
  // Global data(domain data)
  // 1. address -> usestate
  const [myAddress, setMyAddress] = useState(DEFAULT_ADDRESS);

  // 2. nft
  const [nfts, setNfts] = useState([]); // [{tokenId: integer, tokenUri: string},{ tokenId: 100, tokenUri: "101" }...]


  // tab
  const [tab, setTab] = useState('SEARCH'); // SEARCH, ENROLL, MY, LOG

  // ui
  const [enrollString, setEnrollString] = useState(
    {
      title: "", 
      tokenUri: "", 
      description: "", 
      category: 0, 
      sector: 0
    });


  // min input

  // modal

  // balance
  const [myBalance, setMyBalance] = useState('0');


  // on click mint
  // on click my card
  // on click market card

  const [qrvalue, setQrvalue] = useState(DEFAULT_QR_CODE);
  const [logs, setLogs] = useState([]);
  const [tkId, setTkId] = useState(0);
  // const [address, setAddress] = useState('no address');

  // fetch market nft
  // fetch my nfts
  const fetchMyNFTs = () => {
    // [{tokenId:100, tokenUri: ".png"},...]
    // 3 fn :
    //  balanceOf => 소유 NFT 토큰 개수,
    //  tokenOfOwnerByIndex => 인덱스별 토큰ID => 배열로 만들기,
    //  tokenURI => 토큰아이디에 대한 URI정보 가져오기
  }

  const results = fuse.search(query);
  const characterResults = query ? results.map(character => character.item) : characters;

  function onSearch({ currentTarget }) {
    updateQuery(currentTarget.value);
  }

  console.log("enrollString");
  console.log(enrollString);
  console.log(enrollString.tokenUri.indexOf(".jpg") !== -1 || enrollString.tokenUri.indexOf(".png") !== -1);
  
  console.log("test!");
  console.log(typeof process.env.REACT_APP_KAS_ACCESS_KEY_ID);
  console.log(process.env.REACT_APP_KAS_ACCESS_KEY_ID);
  console.log(process.env.REACT_APP_MARKLOG_CYPRESS_CONTRACT_ADDRESS);
  console.log(process.env.REACT_APP_MARKLOG_BAOBAB_CONTRACT_ADDRESS);
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

  const onClickEnrollTrademark_old = () => {
    // const addressval = document.getElementById('address').innerText;
    // const addressval = myAddress;
    const input1val = document.getElementById('input1').value;
    const input2val = document.getElementById('input2').value;
    KlipAPI.enrollTrademark(myAddress, input1val, input2val, setQrvalue);
    alert('등록');
  }

  const onClickEnrollTrademark = async (uri) => {
    // const addressval = document.getElementById('address').innerText;
    // const addressval = myAddress;
    const rn = await genRandomTokenId();
    // const input1val = document.getElementById('input1').value;
    // const input2val = document.getElementById('input2').value;
    KlipAPI.enrollTrademark(myAddress, rn, uri, setQrvalue, (result) => {
      console.log(JSON.stringify(result));
    }); //address, _tokenId, _tokenUri, _setQrvalue, callback
    alert('등록');
  }

  const genRandomTokenId = async () => {
    const randomTokenId = parseInt(Math.random() * 1000000000); // 10억, billion
    const _tks = await CaverAPI.enrolledTokens();
    console.log('random number:');
    console.log(randomTokenId);
    if (_tks.indexOf(randomTokenId) !== -1) {
      console.log('failed random number:');
      console.log(randomTokenId);
      genRandomTokenId();
    } else {
      console.log('successed random number!');
      console.log(randomTokenId);
      return randomTokenId;
    }
  }

  const indexof = 'test.'.indexOf(".png");
  console.log("indexof");
  console.log(indexof);

  // const test = CaverAPI.readTokens().then((s) => {
    // console.log('test token');
    // console.log(s);
    // console.log(typeof s);

    // setNfts(s);
    // const arr = s.map((e)=>{
    //   console.log('e');
    //   console.log(e);
    //   console.log(e.tokenId);
    //   console.log(e.tokenUri);
    // });
    // console.log(arr);
  // });

  const getAllTokens = async () => {
    const _tokens = await CaverAPI.readTokens();
    console.log("$$$$$$$$$$$$$ _tokens $$$$$$$$$$$$$$$$$$$$$$");
    console.log(_tokens);
    setNfts(_tokens);
    // alert('get tokens');
  }

  const onClickLogList = async (_tokenId) => {
    setTab("LOG");
    setTkId(_tokenId);
    setLogs(await getLogs(_tokenId));
  }




  // const test1 = KlipAPI.getEnrolledTokens(setQrvalue);
  // console.log('test kas');
  // console.log(test1);

  const getLogs = async (_tokenId) => {
    console.log('test log:' + _tokenId);
    const test2 = await CaverAPI.getLogsAll(_tokenId);
    console.log(test2);
  }

  // console.log('test');
  // console.log(getLogs(2));

  useEffect(() => {
    getUserData();
    getAllTokens();
  }, [])

  return (
    <div className="App">
      <h1>개발 중인 페이지 입니다.</h1>
      <h3>정상 동작되는 기능</h3>
      <ol>
        <li>탭 이동</li>
        
      </ol>
      <h3>미구현 기능</h3>
      <ol>
        <li>검색데이터 구축</li>
        <li>상표 등록</li>
        
      </ol>
      <div style={{ backgroundColor: '#FAEBEF', padding: 10 }}>
        {/* 주소 잔고 */}
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
        {/* {process.env.NODE_ENV} */}
        {/* <em>%REACT_APP_KAS_ACCESS_KEY_ID%</em> */}
        <br />
        <Alert
          variant={'balance'}
          style={{ backgroundColor: '#333D79', fontSize: 25 }}>
          <p>잔고 : {myBalance}</p>
        </Alert>

        <Container style={{ backgroundColor: 'white', width: 300, padding: 20 }}>
          <QRCode value={qrvalue} size={256} style={{ margin: 'auto' }} />
          <br />
        </Container>



      </div>


      {/* <h1
        title="getLogs"
        color="#ff5c5c"
        onClick={getLogs(2)}
      >getLogs</h1> */}

      {/* <button
        title="get userdata"
        color="#ff5c5c"
        onClick={getUserData}
      >get userdata</button> */}

      {/* <button
        title="getAllTokens"
        color="#ff5c5c"
        onClick={getAllTokens}
      >
        getAllTokens
      </button> */}
      {tab === 'SEARCH' && (
        <div>
          {/* <input type="text" value={query} /> */}
          {/* <input type="text" value={query} onChange={onSearch} /> */}
          <aside>
            <form className="search">
              <label>Search</label>
              <input type="text" value={query} onChange={onSearch} />
            </form>
          </aside>
          <ul className="characters">
          {characterResults.map((character,index) => {
            const { title, tokenUri, description, category, sector } = character;
            return (
              <li key={`tkey${index}`} className="character">
                {(tokenUri.indexOf('.png')=== -1 ||tokenUri.indexOf('.jpg')=== -1) ? (
                  <span className="character-thumb" />
                ) : (
                  <span className="character-thumb" style={{
                    backgroundImage: `url(${tokenUri})`
                  }} />
                )}
                
                <ul className="character-meta">
                  <li>
                    <strong>title:</strong> { title }
                  </li>
                  <li>
                    <strong>tokenUri:</strong> { tokenUri }
                  </li>
                  <li>
                    <strong>description:</strong> { description }
                  </li>
                  <li>
                    <strong>category:</strong> { category }
                  </li>
                  <li>
                    <strong>sector:</strong> { sector }
                  </li>
                </ul>
              </li>
            )
          })}
        </ul>
        </div>
      )}
      

{/* {nfts} */}
{/* {nfts.map((e, i) => (<h1>{nft.tokenId}</h1>))} */}

      {/* 발행페이지 */}
      {tab === 'ENROLL' && (
        <div className="container" style={{ padding: 0, width: "100%" }}>
          enrollString
          <br />
          {(enrollString.tokenUri.indexOf(".png")!== -1  || enrollString.tokenUri.indexOf(".jpg")!== -1 )}
          {console.log(enrollString.tokenUri.indexOf(".jpg") == -1) }
          <br />
          {enrollString.sector}
          <br />
          <Card
            className="text-center"
            style={{ color: "black", height: "50%", borderColor: "#c5b358" }}
          >
            <Card.Body style={{ opacity: 0.9, backgroundColor: "black" }}>
                  <div>
                  {enrollString.tokenUri.indexOf(".png") !== -1 || enrollString.tokenUri.indexOf(".jpg") !== -1 &&
                  <Card.Img src={enrollString.tokenUri} height="50%" />}
                  <Form>
                    <Form.Group>
                      {/* 텍스트 인풋 */}
                      <Form.Control
                        onChange={(e) => {
                          console.log({title:e.target.value});
                          setEnrollString(prevState => ({
                            ...prevState,
                            title: e.target.value
                            })
                          );
                        }}
                        type="text"
                        placeholder="등록할 상표 이름"
                      />
                      <Form.Control
                        onChange={(e) => {
                          console.log({tokenUri:e.target.value});
                          setEnrollString(prevState => ({
                            ...prevState,
                            tokenUri: e.target.value
                            })
                          );
                        }}
                        type="text"
                        placeholder="등록할 URI (이미지 파일 jpg 또는 png)"
                      />
                      <Form.Control
                        onChange={(e) => {
                          console.log({description:e.target.value});
                          setEnrollString(prevState => ({
                            ...prevState,
                            description: e.target.value
                            })
                          );
                          
                        }}
                        type="text"
                        placeholder="등록할 상표 설명"
                      />
                      <Form.Control
                        onChange={(e) => {
                          console.log({category:e.target.value});
                          setEnrollString(prevState => ({
                            ...prevState,
                            category: e.target.value
                            })
                          );
                        }}
                        type="number"
                        placeholder="등록할 상표 종류"
                      />
                      <Form.Control
                        onChange={(e) => {
                          console.log({sector:e.target.value});
                          setEnrollString(prevState => ({
                            ...prevState,
                            sector: e.target.value
                            })
                          );
                        }}
                        type="number"
                        placeholder="등록할 상표"
                      />
                    </Form.Group>
                    <br />
                    <Button
                      onClick={() => { 
                        //onClickEnrollTrademark(enrollString);
                        alert('등록테스트');
                       }}
                      variant="primary" style={{
                        backgroundColor: "#810034",
                        borderColor: "#810034"
                      }}>Primary</Button>{' '}
                  </Form>
                  </div>
            </Card.Body>
          </Card>
        </div>
      )}

      {tab === 'MY' && (
        <div>
          <ul className="characters">
          {characterResults.map((character,index) => {
            const { title, tokenUri, description, category, sector } = character;
            return (
              <li key={`tkey${index}`} className="character">
                {tokenUri.indexOf('.png')=== -1 ? (
                  <span className="character-thumb" />
                ) : (
                  <span className="character-thumb" style={{
                    backgroundImage: `url(${tokenUri})`
                  }} />
                )}
                
                <ul className="character-meta">
                  <li>
                    <strong>title:</strong> { title }
                  </li>
                  <li>
                    <strong>tokenUri:</strong> { tokenUri }
                  </li>
                  <li>
                    <strong>description:</strong> { description }
                  </li>
                  <li>
                    <strong>category:</strong> { category }
                  </li>
                  <li>
                    <strong>sector:</strong> { sector }
                  </li>
                </ul>
              </li>
            )
          })}
        </ul>
        </div>
      )}

      {tab === 'LOG' && (
        <div className="container" style={{ padding: 0, width: "100%" }}>
          <h1>LOG 리스트</h1>
          <ul>
            {logs.map((l, i) => (
              <li 
                key={l.timestamp + i}
              >
                `key=${l.timestamp + i}`
                {l.contents}:{l.timestamp}
              </li>
            ))}
          </ul>
        </div>
      )}



      {/* <div>
        {nfts}
      </div> */}



      {/* 갤러리(마켓, 내 지갑 공유하는 ui) */}
      <Container style={{ padding: 0, width: "100%", height: "100px" }}>

      </Container>
      {/* 탭 */}
      <nav
        style={{ backgroundColor: "#1b1717", height: 45, color: 'white' }}
        className="navbar fixed-bottom navbar-light"
        role="navigation"
      >
        <Nav className="w-100">
          <div className="d-flex flex-row justify-content-around w-100">
            <div
              onClick={() => {
                setTab("SEARCH");
                getAllTokens();
              }}
              className="row d-flex flex-column justify-content-center align-items-center"
            >
              <div>SEARCH</div>
            </div>

            <div
              onClick={() => {
                setTab("ENROLL");
              }}
              className="row d-flex flex-column justify-content-center align-items-center"
            >
              <div>ENROLL</div>
            </div>
            <div
              onClick={() => {
                setTab("MY");
              }}
              className="row d-flex flex-column justify-content-center align-items-center"
            >
              <div>MY</div>
            </div>
            <div
              onClick={() => {
                setTab("LOG");
              }}
              className="row d-flex flex-column justify-content-center align-items-center"
            >
              <div>LOG</div>
            </div>

          </div>

        </Nav>
      </nav>
      {/* 모달 */}

    </div>


  );
}

export default App;
