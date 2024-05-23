import { Contract, ethers } from "ethers";
import { useEffect, useState } from "react";
import abi from "./abi.json";

const App = () => {
  const [signer, setSigner] = useState();
  const [contract, setContract] = useState();

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
  };

  useEffect(() => {
    if (!signer) return;

    setContract(
      new Contract("0xa20dED068e956290c459ad3162d78B93a7109be3", abi, signer)
    );
  }, [signer]);

  useEffect(() => console.log(contract), [contract]);

  return (
    <div className="bg-red-100 min-h-screen flex flex-col justify-start justify-center items-center  py-16">
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
        <div className="mt-16">
          <h1 className="box-style">스마트 컨트랙트 연결을 완료했습니다.</h1>
        </div>
      )}
    </div>
  );
};

export default App;
