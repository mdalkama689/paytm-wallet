import React, { useState } from "react";
import { ClipLoader } from "react-spinners";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validateForm, setValidateForm] = useState(false);
  const [formValues, setFormValues] = useState({
    firstname: "",
    lastname: "",
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
    const nameRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿ'-]+(?:\s+[a-zA-ZÀ-ÖØ-öø-ÿ'-]+)*$/;
    const emailRegex =
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;

    const isFirstNameValid =
      newFormValues.firstname.trim().length >= 2 &&
      newFormValues.firstname.trim().length <= 15 &&
      nameRegex.test(newFormValues.firstname);
    const isLastNameValid =
      newFormValues.lastname.trim().length >= 2 &&
      newFormValues.lastname.trim().length <= 15 &&
      nameRegex.test(newFormValues.lastname);
    const isEmailValid = emailRegex.test(formValues.email);
    const isPasswordValid = formValues.password.trim().length >= 8;

    return (
      isFirstNameValid && isLastNameValid && isEmailValid && isPasswordValid
    );
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/user/register", formValues);
      if (response?.data?.success) {
        toast.success("Registration successful!");
        navigate("/login");
      }
    } catch (error) {
      console.log("error during hit register api : ", error);
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
      <h1></h1>
      <form
        onSubmit={handleRegisterSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <div className="mb-4">
          <label htmlFor="firstname" className="block text-gray-700">
            Fisrtname
          </label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            placeholder="Enter your firstname"
            className="mt-1 px-3 py-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formValues.firstname}
            onChange={handleInputValues}
            disabled={isLoading}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="lastname" className="block text-gray-700">
            Lastname
          </label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            placeholder="Enter your lastname"
            className="mt-1 px-3 py-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formValues.lastname}
            onChange={handleInputValues}
            disabled={isLoading}
          />
        </div>

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
      <div className=" flex items-center gap-1 justify-center max-w-sm w-full pb-3 mt-[-10px] bg-white">
        Already have an account?{" "}
        <Link to="/login" className=" text-blue-500 hover:underline">
          <p>Login here</p>
        </Link>
      </div>
    </div>
  );
};

export default Register;
