# Notice: 
2022년 1월 부터 개발 재개 예정입니다.  
Development is expected to resume in Jan. 2022.  

Gist:  
https://gist.github.com/wadro/6fac56024ba4e2ebda34ec354ce0dbf6

# klaytn-react-app
LikeLion(멋쟁이사자처럼) Klaytn NFT 강의 구현

## 순서
1. npx create-react-app klay-market
2. yarn add axios caver-js qrcode.react
3. klaytn api service 가입
   - klaytn docs &#x279c; caver-js 참고
4. read, write function 테스트
5. 소스 구조 분산
6. 메인넷 cypress
7. react-bootstrap, fontawesome 라이브러리 사용
8. Netlify 배포 ✔️
9. ~~firebase function으로 caver-js 사용하기 (예정)~~
   - Netlify 환경변수 사용 ✔️
     - functions 사용 현재 불필요

> note: 블록체인넷이라서 setFunction 사용시 조금 딜레이 될수 있으니 여러번 클릭하지 말것.

## 목표
- 클라이언트에서 fuse 로 검색구현

## 할일 
1. 스마트 컨트랙트 수정 => enrolledTokens 목록 조회 (unique ID 할당하기 위함)
