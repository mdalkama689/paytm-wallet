import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useSelector } from "react-redux";
const TopSection = () => {
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/user/logout");
      if (response?.data?.success) {
        toast.success("Logged out successful!");
        localStorage.clear();
        navigate("/login");
      }
    } catch (error) {
      console.log("error during hit logout api : ", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  let userDetails = useSelector((state) => state?.auth?.userDetails);

  return (
    <div className=" flex items-center justify-between mx-7 mt-6">
      <div>
        <Link
          to="/"
          className=" text-4xl  font-semibold text-black py-1.5 px-3 "
        >
          payTm App
        </Link>
      </div>
      <div className=" flex items-center justify-center gap-6 mr-4">
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className={`block bg-black text-center text-white px-3 py-1 rounded text-xl hover:bg-gray-900 transition-colors duration-300 ${
            isLoading ? "cursor-not-allowed" : ""
          }`}
        >
          Logout
        </button>

        <Link to="/me">
          <div className="flex -space-x-1 overflow-hidden">
            <p className="flex items-center justify-center h-12 w-12 bg-gray-200 font-bold rounded-full text-center text-black group-hover:bg-gray-300">
              {userDetails?.firstname?.charAt(0).toUpperCase()}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default TopSection;
