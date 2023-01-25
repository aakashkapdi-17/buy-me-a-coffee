import React, { useState } from "react";
import { ABI } from "../ABI/contractABI";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import BeatLoader from "react-spinners/BeatLoader";
import "react-toastify/dist/ReactToastify.css";

const Form = () => {
  const [loading, setLoading] = useState(false);

  const showError = (message) => {
    toast.error(message, {
      position: "top-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const showSuccess = (message) => {
    toast.success(message, {
      position: "top-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const sendCoffee = async () => {
    try {
      //setLoading state
      setLoading(true);
      //Get value of form Input fields
      const _name = document.getElementById("name").value;
      const _message = document.getElementById("message").value;

      //Get Contract details
      const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
      const contractABI = ABI;

      //Get details from ether.js
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      //Connect to contract
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      // Call BuyCoffee function of contract to buy a confee
      const transaction = await contract.BuyCoffee(_name, _message, {
        value: ethers.utils.parseUnits("1", "wei"),
      });

      //Wait for transaction to be mined.
      await transaction.wait().then(() => {
        //Show Success Toast
        showSuccess("Sent A Cofee ");
        setLoading(false);
      });
    } catch (e) {
      {
        e.code == "ACTION_REJECTED"
          ? showError(
              "MetaMask Tx Signature: User denied transaction signature."
            )
          : showError("Error, Try Again");
      }
      setLoading(false);
    }
  };

  return (
    <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      {loading ? (
        <BeatLoader color="#B45309" />
      ) : (
        <>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Name"
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Message
            </label>
            <textarea
              id="message"
              rows="4"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Write your thoughts here..."
            ></textarea>
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={sendCoffee}
            >
              Send 1 Coffee for 0.001 eth
            </button>
          </div>
          <ToastContainer
            position="top-left"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </>
      )}
    </form>
  );
};

export default Form;
