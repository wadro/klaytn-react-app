import axios from 'axios';
import * as log_trademark from '../abi/cypressContract.json';
/**
 * log_trademark.default[0] -> logTrademark
 * log_trademark.default[1] -> mintWithTokenURI
 * log_trademark.default[2] -> safeTransferFrom
 * log_trademark.default[3] -> setTokenUri
 * log_trademark.default[4] -> enrolledTokens
 * log_trademark.default[5] -> logs
 * log_trademark.default[6] -> name
 * log_trademark.default[7] -> ownedTokens
 * log_trademark.default[8] -> symbol
 * log_trademark.default[9] -> timestamps
 * log_trademark.default[10] -> tokenOwner
 * log_trademark.default[11] -> tokenURIs
 */

const CONTRACT_ADDRESS = process.env.REACT_APP_MARKLOG_CYPRESS_CONTRACT_ADDRESS;
// process.env.REACT_APP_MARKLOG_CONTRACT_ADDRESS
const A2A_API_PREPARE_URL = "https://a2a-api.klipwallet.com/v2/a2a/prepare";
const APP_NAME = 'KLAY_MARKET';
const QR_REQUEST = "https://klipwallet.com/?target=/a2a?request_key=";
const KLIP_API_REQUEST = "https://a2a-api.klipwallet.com/v2/a2a/result?request_key=";


console.log(log_trademark.default);

export const getAddress = (_setQrvalue, callbackfn) => {
    axios.post(
        A2A_API_PREPARE_URL,{
            bapp: {
                name: APP_NAME,
            },
            type: "auth"
        }
    ).then((response) => {
        const { request_key } = response.data; // const request_key = response.data.request_key;
        const _qrcode = `${QR_REQUEST}${request_key}`;
        _setQrvalue(_qrcode);
        // window.open(
        //     `${QR_REQUEST}${request_key}`,
        //     '_blank' // <- This is what makes it open in a new window.
        // );
        let timerId = setInterval( () => {
            axios.get(`${KLIP_API_REQUEST}${request_key}`)
              .then((res)=>{
                if (res.data.result) {
                    console.log(`[RESULT] ${JSON.stringify(res.data.result.klaytn_address)}`);
                    callbackfn(res.data.result.klaytn_address);
                    clearInterval(timerId);
                }
            })
        },1000);
    })
}

export const getContract = ( _setQrvalue) => {
    axios.post(
        A2A_API_PREPARE_URL,{ // 지갑 사용해도 되니?
            bapp: {
                name: APP_NAME,
            },
            type: "execute_contract", // 스마트 컨트랙트 실행할게
            transaction: {
                // "from":"",
                // "to":"smart contract address", 
                "to": CONTRACT_ADDRESS,
                "value":"0",
                "abi":JSON.stringify(log_trademark.default[11]), // 함수 abi - tokenUris
                "params":`["0"]`,

            }
        }
    ).then((response) => {
        const { request_key } = response.data; // const request_key = response.data.request_key;
        const _qrcode = `${QR_REQUEST}${request_key}`;
        _setQrvalue(_qrcode);
        let timerId = setInterval( () => {
            axios.get(`${KLIP_API_REQUEST}${request_key}`)
              .then((res)=>{
                if (res.data.result) {
                    console.log(`[RESULT] ${JSON.stringify(res.data.result)}`);
                    if (res.data.result.status == "success"){
                        clearInterval(timerId);
                    }        
                }
            })
        },1000)
    })
}


export const getEnrolledTokens = (_setQrvalue) => {
    axios.post(
        A2A_API_PREPARE_URL,{ // 지갑 사용해도 되니?
            bapp: {
                name: APP_NAME,
            },
            type: "execute_contract", // 스마트 컨트랙트 실행할게
            transaction: {
                // "from":"",
                // "to":"smart contract address", 
                "to": CONTRACT_ADDRESS,
                "value":"0",
                "abi":JSON.stringify(log_trademark.default[4]), // 함수 abi - tokenUris
                "params":"[]",
            }
        }
    ).then((response) => {
        const { request_key } = response.data; // const request_key = response.data.request_key;
        const _qrcode = `${QR_REQUEST}${request_key}`;
        _setQrvalue(_qrcode);

        let timerId = setInterval( () => {
            axios.get(`${KLIP_API_REQUEST}${request_key}`)
              .then((res)=>{
                if (res.data.result) {
                    console.log(`[RESULT] ${JSON.stringify(res)}`);
                    if (res.data.result.status == "success"){
                        clearInterval(timerId);
                    }    
                }
            })
        },1000)
    })
}



export const enrollTrademark = (address, _tokenId, _tokenUri,_setQrvalue) => {
    if(address == "no address"){
        alert('클립 지갑 주소를 먼저 인증해주세요.');
    } else {
        console.log(log_trademark.default[1]);
        console.log(`[${address},"${_tokenId}","${_tokenUri}"]`);
        // `["${address}","${_tokenId}","${_tokenUri}"]`
        axios.post(
            A2A_API_PREPARE_URL,{ // 지갑 사용해도 되니?
                bapp: {
                    name: APP_NAME,
                },
                type: "execute_contract", // 스마트 컨트랙트 실행할게
                transaction: {
                    // "from":"",
                    // "to":"smart contract address",
                    "to": CONTRACT_ADDRESS,
                    // "value":"0",
                    "abi":JSON.stringify(log_trademark.default[1]), // 함수 abi - mint
                    "params":`[${address},"${_tokenId}","${_tokenUri}"]`,
                }
            }
        ).then((response) => {
            const { request_key } = response.data; // const request_key = response.data.request_key;
            const _qrcode = `${QR_REQUEST}${request_key}`;
            _setQrvalue(_qrcode);
            window.open(
                `${QR_REQUEST}${request_key}`,
                '_blank' // <- This is what makes it open in a new window.
            );
            let timerId = setInterval( () => {
                axios.get(`${KLIP_API_REQUEST}${request_key}`)
                .then((res)=>{
                    if (res.data.result) {
                        console.log(`[RESULT] ${JSON.stringify(res.data)}`);

                        if (res.data.result.status == "success"){
                            alert('등록 성공!');
                            clearInterval(timerId);

                        } else if(res.data.result.status == "fail"){
                            alert('이미 등록된 번호 입니다.');
                            clearInterval(timerId);
                        }
                    }
                })
            },1000)
        })
    } 
}


// logTrademark (from:address, tokenId:uint256, logData:string)