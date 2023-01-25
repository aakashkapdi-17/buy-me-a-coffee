import { createContext, useState } from "react";

import Connect from "../components/Connect";
import Form from "../components/Form";

export const walletAddressContext = createContext();

const Home = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  return (
    <>
      <walletAddressContext.Provider
        value={{ walletAddress, setWalletAddress }}
      >
        <div className="h-screen bg-gray-300 flex flex-col items-center justify-center">
          <h1 className="p-6 text-3xl font-bold">Buy Aakash a Coffee !</h1>
          <div className="bg-amber-700 p-4 rounded-lg flex flex-col justify-center">
            {walletAddress == null ? <Connect /> : <Form />}
          </div>
        </div>
      </walletAddressContext.Provider>
    </>
  );
};

export default Home;
