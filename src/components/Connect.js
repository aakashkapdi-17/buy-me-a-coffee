import React, { useContext } from "react";
import { walletAddressContext } from "../pages/Home";

const Connect = () => {
  const { walletAddress, setWalletAddress } = useContext(walletAddressContext);
  function connectWallet() {}

  return (
    <div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="button"
        onClick={connectWallet}
      >
        Connect Wallet
      </button>
    </div>
  );
};

export default Connect;
