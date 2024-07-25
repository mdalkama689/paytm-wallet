import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../api/axiosInstance";
import { setUserDetails, setIsLoggedIn } from "../redux/Slices/AuthSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validateForm, setValidateForm] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  const handleInputValues = (e) => {
    const { name, value } = e.target;
    const newFormValues = { ...formValues, [name]: value };
    setFormValues(newFormValues);
    setValidateForm(isFormValid(newFormValues));
  };

  const isFormValid = (newFormValues) => {
    const isEmailValid = newFormValues.email.trim().length > 0;
    const isPasswordValid = newFormValues.password.trim().length > 0;
    return isEmailValid && isPasswordValid;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/user/login", formValues);
      if (response?.data?.success) {
        toast.success("Logged in successful!");
        navigate("/");
        dispatch(setUserDetails(response?.data?.user));
        localStorage.setItem(
          "userDetails",
          JSON.stringify(response?.data?.user)
        );
        dispatch(setIsLoggedIn(true));
        localStorage.setItem("isLoggedIn", true);
      }
    } catch (error) {
      console.log("error during hit login api : ", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLoginSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700">
            Email
          </label>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="Enter your email"
            className="mt-1 px-3 py-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formValues.email}
            onChange={handleInputValues}
            disabled={isLoading}
          />
        </div>

        <div className="mb-4 relative">
          <label htmlFor="password" className="block text-gray-700">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            placeholder="Enter your password"
            className="mt-1 px-3 py-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formValues.password}
            onChange={handleInputValues}
            disabled={isLoading}
          />
          <button
            type="button"
            className="absolute right-2 top-10 bg-gray-300 hover:bg-gray-400 text-gray-700 px-2 py-1 rounded focus:outline-none"
            onClick={togglePassword}
          >
            {showPassword ? <IoMdEye /> : <IoMdEyeOff />}
          </button>
        </div>

        <button
          type="submit"
          className={`w-full py-2 rounded transition duration-300
            ${
              !validateForm || isLoading
                ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-950"
            }
          `}
          disabled={isLoading || !validateForm}
        >
          {isLoading ? <ClipLoader size={20} color={"#ffffff"} /> : "Login"}
        </button>
      </form>
      <div className=" flex flex-col items-center gap-1 justify-center max-w-sm w-full pb-3 mt-[-10px] bg-white">
        <Link className=" text-blue-500 hover:underline" to="/forgot/password">
          Forgot password
        </Link>
        <div className=" flex items-center justify-center">
          Don't have an account?{" "}
          <Link to="/register" className=" text-blue-500 hover:underline">
            <p>Register here</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
