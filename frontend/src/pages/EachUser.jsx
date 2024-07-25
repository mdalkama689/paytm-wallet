import React from "react";
import { useNavigate } from "react-router-dom";

const EachUser = ({ allUsersDetails }) => {
  const navigate = useNavigate();

  const handleEachUserLink = (eachUserDetails) => {
    navigate(`/user/${eachUserDetails._id}`, {
      state: {
        firstname: eachUserDetails.firstname,
        lastname: eachUserDetails.lastname,
        toId: eachUserDetails._id,
      },
    });
  };
  return (
    <>
      {allUsersDetails.length === 0 ? (
        <div className="flex justify-center items-center h-screen">
          <p className="text-black text-3xl font-semibold">No user found!</p>
        </div>
      ) : (
        allUsersDetails.map((eachUserDetails, index) => (
          <div
            key={index}
            onClick={() => handleEachUserLink(eachUserDetails)}
            className="flex items-center justify-between px-6 mx-6 hover:bg-gray-200 rounded py-2 group"
          >
            <div className="flex items-center justify-center gap-4">
              <p className="flex items-center justify-center h-12 w-12 bg-gray-200 rounded-full text-center text-black group-hover:bg-gray-300">
                {eachUserDetails?.firstname.charAt(0).toUpperCase()}
              </p>
              <p className="text-black text-xl font-semibold">
                {eachUserDetails?.firstname} {eachUserDetails?.lastname}
              </p>
            </div>
            <div>
              <button
                type="submit"
                className="w-full py-2 px-3 rounded transition duration-300 bg-black text-white hover:bg-gray-950"
              >
                Send Money
                {/* {isLoading ? <ClipLoader size={20} color={"#ffffff"} /> : "Login"} */}
              </button>
            </div>
          </div>
        ))
      )}
    </>
  );
};

export default EachUser;
