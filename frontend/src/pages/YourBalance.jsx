import React, { useEffect, useState } from "react";
import { GrTransaction } from "react-icons/gr";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const YourBalance = () => {
  const [balance, setBalance] = useState("");

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await axiosInstance.get("/account/balance");
        setBalance(response?.data?.account?.balance);
      } catch (error) {
        console.log("error during checking balance :", error);
      }
    };
    fetchBalance();
  }, []);

  return (
    <div className=" flex items-center justify-between">
      <div>
        <h5 className=" text-black mt-8 ml-3 text-2xl font-bold">
          Your balance : ₹{balance}
        </h5>

        <h2 className=" text-black mt-5 ml-3 text-2xl font-bold ">All Users</h2>
      </div>
      <div>
        <Link to="/transaction-history">
          <button className=" text-black mr-12 text-4xl py-1.5 px-3 rounded transition duration-300 hover:bg-slate-300">
            <GrTransaction />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default YourBalance;
