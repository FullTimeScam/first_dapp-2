import { Contract, ethers, formatEther } from "ethers";
import { useEffect, useState } from "react";
import abi from "./abi.json";

const App = () => {
  const [signer, setSigner] = useState();
  const [contract, setContract] = useState();
  const [totalSupply, setTotalSupply] = useState(); // totalSupply 상태 변수 추가
  const [tokenName, setTokenName] = useState(); // tokenName 상태 변수 추가
  const [myBalance, setmyBalance] = useState(); // balance 상태 변수 추가
  const [symbol, setSymbol] = useState();

  const onClickMetamask = async () => {
    try {
      if (!window.ethereum) return;

      const provider = new ethers.BrowserProvider(window.ethereum);

      setSigner(await provider.getSigner());
    } catch (error) {
      console.error(error);
    }
  };

  const onClickLogOut = () => {
    setSigner(null);
    setContract(null);
    setTotalSupply(null);
    setTokenName(null);
    setmyBalance(null);
    setSymbol(null);
  };

  //총 발행량 가져오기
  const onClickTotalSupply = async () => {
    try {
      const response = await contract.totalSupply();

      console.log(response);

      const parsedResponse = formatEther(response);
      console.log(parsedResponse);

      setTotalSupply(response); // totalSupply 값 설정
    } catch (error) {
      console.error(error);
    }
  };

  //이름 가져오기
  const onClicktokenName = async () => {
    try {
      const response = await contract.name();

      console.log(response);

      setTokenName(response); // tokenName 값 설정
    } catch (error) {
      console.error(error);
    }
  };

  //밸런스 가져오기
  const onClickBalance = async () => {
    try {
      const response = await contract.balanceOf(signer.address);

      console.log(response);

      setmyBalance(response); // balance 값 설정
    } catch (error) {
      console.error(error);
    }
  };

  //심볼 가져오기
  const getSymbol = async () => {
    try {
      const response = await contract.symbol();

      setSymbol(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!signer) return;

    setContract(
      new Contract("0xa20dED068e956290c459ad3162d78B93a7109be3", abi, signer)
    );
  }, [signer]);

  useEffect(() => {
    if (!contract) return;
    getSymbol();
  }, [contract]);

  return (
    <div className="bg-red-100 min-h-screen flex flex-col justify-start items-center py-16">
      {signer ? (
        <div className="flex gap-8">
          <div className="box-style">
            안녕하세요, {signer.address.substring(0, 7)}...
            {signer.address.substring(signer.address.length - 5)}님
          </div>
          <button
            className="button-style border-red-300 hover:border-red-400"
            onClick={onClickLogOut}
          >
            로그아웃
          </button>
        </div>
      ) : (
        <button className="button-style" onClick={onClickMetamask}>
          🦊 메타마스크 로그인
        </button>
      )}
      {contract && (
        <div className="mt-16 flex flex-col gap-8 bg-blue-100 grow max-w-md w-full">
          <h1 className="box-style">스마트 컨트랙트 연결을 완료했습니다.</h1>
          <div className="flex flex-col gap-8">
            <div className="flex w-full">
              <div className="box-style grow">
                {tokenName ? `토큰 이름: ${tokenName}` : "토큰 이름 확인"}
              </div>
              <button className="button-style ml-4" onClick={onClicktokenName}>
                확인
              </button>
            </div>
            <div className="flex w-full">
              <div className="box-style grow">
                {myBalance
                  ? `밸런스: ${formatEther(myBalance)} ${symbol}`
                  : "밸런스 확인"}
              </div>
              <button className="button-style ml-4" onClick={onClickBalance}>
                확인
              </button>
            </div>
            <div className="flex w-full">
              <div className="box-style grow">
                {totalSupply
                  ? `총 발행량: ${formatEther(totalSupply)} ${symbol}`
                  : "총 발행량 확인"}
              </div>
              <button
                className="button-style ml-4"
                onClick={onClickTotalSupply}
              >
                확인
              </button>
            </div>
            <div className="flex w-full items-end">
              <div className="flex flex-col gap-2 grow">
                <div className="ml-1 text-lg font-bold">토큰 전송</div>
                <input
                  className="input-style"
                  type="text"
                  placeholder="지갑 주소"
                />
                <input
                  className="input-style"
                  type="text"
                  placeholder={`${symbol}을 입력하세요.`}
                />
              </div>
              <button
                className="button-style ml-4 h-[128px]"
                onClick={onClickBalance}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
