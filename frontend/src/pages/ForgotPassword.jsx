import React, { useState } from "react";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import axiosInstance from "../api/axiosInstance";

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/user/forgot/password", {
        email,
      });
      toast.success(response?.data?.message);
      setEmail("");
    } catch (error) {
      console.log("error during hit forgot password api : ", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleForgotPassword}
        className="bg-white p-3 rounded shadow-md w-full max-w-sm"
      >
        <h4 className=" text-black text-center pb-3 font-semibold text-xl">
          Forgot password
        </h4>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          ></label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="mt-1 text-black px-3 py-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className={`w-full py-2 rounded transition duration-300
           ${
             isLoading || !email.trim().length > 0
               ? "bg-gray-300 text-gray-700 cursor-not-allowed"
               : "bg-black text-white hover:bg-gray-950"
           }
         `}
          disabled={isLoading}
        >
          {isLoading ? <ClipLoader size={20} color={"#ffffff"} /> : "Send Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
