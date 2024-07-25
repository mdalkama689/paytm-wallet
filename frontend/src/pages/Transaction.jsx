import React, { useEffect, useState } from "react";
import MainLayout from "../components/HomeLayout";
import axiosInstance from "../api/axiosInstance";
import { WiDirectionDownRight, WiDirectionUpRight } from "react-icons/wi";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

const Transaction = () => {
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/account/transactions");
        setTransactionHistory(response?.data?.allHistory);
      } catch (error) {
        console.log("error during sending money :", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactionHistory();
  }, []);
  const getUserDetails = useSelector((state) => state?.auth?.userDetails);

  useEffect(() => {
    setUserDetails(getUserDetails);
  }, []);

  const shortMonths = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const formatTimeStamp = (timeStamp) => {
    const date = new Date(parseInt(timeStamp));
    const getFullYear = date.getFullYear();
    const getMonth = shortMonths[date.getMonth()];
    const getHour = date.getHours().toString().padStart(2, "0");
    const getMinute = date.getMinutes().toString().padStart(2, "0");
    const getDate = date.getDate().toString().padStart(2, "0");

    const formateDate = `${getDate} ${getMonth} ${getFullYear}`;
    const formateTime = `${getHour}:${getMinute}`;

    return { formateDate, formateTime };
  };

  return (
    <MainLayout>
      <div className=" mt-6 flex flex-col gap-3">
        <h1 className=" text-black text-center font-bold text-5xl mb-3">
          All transactions history
        </h1>
        {isLoading ? (
          <div className=" text-black flex items-center justify-center min-h-screen">
            <ClipLoader />
          </div>
        ) : (
          transactionHistory?.map((eachTransactionHistory) => (
            <div
              key={eachTransactionHistory._id}
              className="flex  items-center justify-between px-6 mx-6 bg-gray-200 hover:bg-gray-300 transition duration-300 rounded py-2 group"
            >
              <div className="flex items-center justify-center gap-4">
                <div>
                  <div className="flex justify-center items-center gap-2 font-semibold ">
                    {eachTransactionHistory?.from._id == userDetails?._id ? (
                      <div className=" bg-red-500 rounded-full">
                        <WiDirectionUpRight className=" text-4xl" />
                      </div>
                    ) : (
                      <div className="bg-green-600 rounded-full">
                        <WiDirectionDownRight className=" text-4xl" />
                      </div>
                    )}
                    {eachTransactionHistory?.from._id == userDetails?._id ? (
                      <p className="text-black text-lg mt-3 ml-3">
                        Paid to{" "}
                        <span className=" font-bold">
                          {eachTransactionHistory?.to?.firstname}{" "}
                          {eachTransactionHistory?.to?.lastname}{" "}
                        </span>
                      </p>
                    ) : (
                      <p className="text-black text-lg mt-3 ml-3">
                        Recieved from{" "}
                        <span className=" font-bold">
                          {eachTransactionHistory?.from?.firstname}{" "}
                          {eachTransactionHistory?.from?.lastname}{" "}
                        </span>
                      </p>
                    )}
                  </div>
                  <div className=" flex items-center text-justify ml-2 gap-2">
                    <p className="text-black">
                      {
                        formatTimeStamp(eachTransactionHistory?.date)
                          ?.formateDate
                      }
                    </p>

                    <p className="text-black">
                      {
                        formatTimeStamp(eachTransactionHistory?.date)
                          ?.formateTime
                      }
                    </p>
                  </div>
                </div>
              </div>
              <div className=" flex flex-col items-center justify-center font-bold">
                {eachTransactionHistory?.from._id == userDetails?._id ? (
                  <p className="  text-black text-lg font-semibold">
                    {" "}
                    - ₹{eachTransactionHistory?.amount}
                  </p>
                ) : (
                  <p className="  text-black text-lg font-semibold">
                    {" "}
                    + ₹{eachTransactionHistory?.amount}
                  </p>
                )}

                {eachTransactionHistory?.from._id == userDetails?._id ? (
                  <p className=" text-red-600">Dr</p>
                ) : (
                  <p className=" text-green-600">Cr</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </MainLayout>
  );
};

export default Transaction;
