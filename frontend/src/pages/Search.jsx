import React, { useEffect, useState } from "react";
import { debounce } from "lodash";
import axiosInstance from "../api/axiosInstance";
import EachUser from "./EachUser";
import { ClipLoader } from "react-spinners";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    sendSearchQuery("");
  }, []);

  const debouncedSendRequest = debounce((query) => {
    sendSearchQuery(query);
  }, 500);

  const searchQueryFunc = (e) => {
    setSearchQuery(e.target.value);
    debouncedSendRequest(e.target.value);
  };

  const sendSearchQuery = async (query) => {
    try {
      setIsLoading(true);
      const searchUser = await axiosInstance.get(
        `/user/search?filter=${query}`
      );
      setAllUsers(searchUser?.data?.users);
    } catch (error) {
      console.log("error during search user : ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="p-4 bg-gray-100 rounded-lg">
        <input
          type="text"
          onChange={searchQueryFunc}
          value={searchQuery}
          placeholder="Search..."
          className="p-2 text-black w-full bg-white rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
        />
      </div>
      {isLoading ? (
        <div className=" text-black flex items-center justify-center min-h-screen">
          <ClipLoader />
        </div>
      ) : (
        <EachUser allUsersDetails={allUsers} />
      )}
    </>
  );
};

export default Search;
