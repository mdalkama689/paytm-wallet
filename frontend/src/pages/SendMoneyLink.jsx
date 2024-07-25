import React, { useEffect, useState } from "react";
import HomeLayout from "../components/HomeLayout";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";

const SendMoneyLink = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { firstname, lastname, toId } = location?.state;
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [isAmountValid, setIsAmountValid] = useState(false);

  useEffect(() => {
    if (amount.trim().length > 0 && !isNaN(amount) && Number(amount) > 0) {
      setIsAmountValid(true);
    } else {
      setIsAmountValid(false);
    }
  }, [amount]);

  const checkIsAmountValid = (value) => {
    if (!isNaN(value) && value > 0) {
      return true;
    } else {
      return false;
    }
  };

  const handleChangeAmount = (e) => {
    const value = e.target.value;
    setIsAmountValid(checkIsAmountValid(value));
    setAmount(value);
  };

  const handleSendMoney = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(`/account/transfer/${toId}`, {
        to: toId,
        amount,
      });
      if (response?.data?.success) {
        toast.success("Transafer successful!");
        navigate("/");
      }
    } catch (error) {
      console.log("error during hit transfer api : ", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
      setAmount("");
    }
  };

  return (
    <HomeLayout>
      <div className=" grid place-items-center h-screen">
        <div className=" bg-gray-100 w-[400px] py-5 rounded">
          <h1 className=" text-black text-center font-semibold text-[40px]">
            Send Money{" "}
          </h1>
          <h3 className=" text-black  mt-16 ml-4 text-xl font-normal">
            {firstname} {lastname}
          </h3>
          <p className=" text-black ml-3 mt-1 text-xs">Amount(in Rs)</p>
          <div className=" flex flex-col mt-5 px-4 pb-5 ">
            <input
              type="text"
              placeholder="Enter amount"
              className="border text-black pl-3  border-gray-300 p-1 rounded"
              onChange={handleChangeAmount}
              value={amount}
            />

            <button
              onClick={handleSendMoney}
              type="submit"
              className={`w-full py-2 mt-4 rounded transition duration-300
            ${
              !isAmountValid || isLoading
                ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-950"
            }
          `}
              disabled={!isAmountValid || isLoading}
            >
              {isLoading ? (
                <ClipLoader size={20} color={"#ffffff"} />
              ) : (
                "Initiate Transfer"
              )}
            </button>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
};

export default SendMoneyLink;
