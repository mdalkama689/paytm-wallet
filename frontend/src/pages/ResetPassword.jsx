import React, { useState } from "react";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import axiosInstance from "../api/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { newPassword, confirmPassword } = formData;
      const response = await axiosInstance.post(
        `/user/reset/password/${token}`,
        { newPassword, confirmPassword }
      );

      toast.success(response?.data?.message);
      setFormData({
        newPassword: "",
        confirmPassword: "",
      });
      navigate("/login");
    } catch (error) {
      console.error("Error during hit forgot password API: ", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const isValidForm =
    formData.newPassword.length >= 8 &&
    formData.newPassword === formData.confirmPassword;

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleResetPassword}
        className="bg-white p-3 rounded shadow-md w-full max-w-sm"
      >
        <h4 className="text-black text-center pb-3 font-semibold text-xl">
          Reset Password
        </h4>
        <div className="mb-4">
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-gray-700"
          >
            New Password
          </label>
          <input
            type="text"
            id="newPassword"
            name="newPassword"
            placeholder="Enter new password"
            value={formData.newPassword}
            onChange={handleChange}
            disabled={isLoading}
            className="mt-1 text-black px-3 py-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Enter confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={isLoading}
            className="mt-1 text-black px-3 py-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className={`w-full py-2 rounded transition duration-300 ${
            isLoading || !isValidForm
              ? "bg-gray-300 text-gray-700 cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-950"
          }`}
          disabled={isLoading || !isValidForm}
        >
          {isLoading ? <ClipLoader size={20} color={"#ffffff"} /> : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
