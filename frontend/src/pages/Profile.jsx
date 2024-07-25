import React, { useEffect, useReducer, useState } from "react";
import MainLayout from "../components/HomeLayout";
import toast from "react-hot-toast";
import axiosInstance from "../api/axiosInstance";
import { ClipLoader } from "react-spinners";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
  });

  const fetchUserDetails = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/user/me");
      setFormData({
        firstname: response?.data?.user?.firstname || "",
        lastname: response?.data?.user?.lastname || "",
        email: response?.data?.user?.email || "",
      });
    } catch (error) {
      console.log("error during fetching user details :", error);
      toast.error("Error during fetching user details! ");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axiosInstance.put(
        "/user/update/profile",
        formData
      );
      if (response?.data?.success) {
        toast.success("User profile updated successfully!");
      }
    } catch (error) {
      console.log("error during hit user profile update api : ", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-4 text-center text-black">
          Your Profile
        </h1>
        {isLoading ? (
          <div className=" text-black flex items-center justify-center min-h-screen">
            <ClipLoader />
          </div>
        ) : (
          <form onSubmit={handleUpdateProfile}>
            <div className="mb-4">
              <label
                htmlFor="firstname"
                className="block text-sm font-medium text-gray-700"
              >
                First Name{" "}
              </label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                value={formData.firstname}
                onChange={handleChangeInput}
                disabled={isLoading}
                className="mt-1 text-black px-3 py-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="lastname"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name{" "}
              </label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                value={formData.lastname}
                disabled={isLoading}
                onChange={handleChangeInput}
                className="mt-1 text-black px-3 py-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="text"
                name="email"
                id="email"
                disabled={isLoading}
                value={formData.email}
                onChange={handleChangeInput}
                className="mt-1 px-3 text-black py-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Save Changes
            </button>
          </form>
        )}
      </div>
    </MainLayout>
  );
};

export default Profile;
