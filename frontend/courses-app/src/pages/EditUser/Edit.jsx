import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import PasswordInput from "../../components/Input/PasswordInput";
import { useNavigate, useLocation } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import Toast from "../../components/ToastMessage/Toast";

const Edit = () => {
  const location = useLocation();
  const userInfo = location.state;
  const [fullName, setFullName ] = useState( userInfo.fullName? userInfo.fullName : "");
  const [age, setAge] = useState(userInfo.age? userInfo.age : "");
  const [phone, setPhone] = useState(userInfo.phone? userInfo.phone : "");
  const [address, setAddress] = useState(userInfo.address? userInfo.address : "");
  const [email, setEmail] = useState(userInfo.email? userInfo.email : "");
  const [password, setPassword] = useState(userInfo.password? userInfo.password : "");
  const [error, setError] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const navigate = useNavigate();

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message: message,
      type,
    });
  };

  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",
    });
  };

  
  const getAllCourses = async () => {
    try {
      const response = await axiosInstance.get("/get-all-courses");

      if (response.data && response.data.courses) {
        setAllCourses(response.data.courses);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  const onSearchCourse = async (query) => {
    try {
      const response = await axiosInstance.get("/search-courses", {
        params: { query },
      });

      if (response.data && response.data.courses) {
        setIsSearch(true);
        setAllCourses(response.data.courses);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  const handleClearSearch = () => {
    setIsSearch(false);
    getAllCourses();
  };


  const handleEditUser = async (e) => {
    e.preventDefault();
    

    if (!validateEmail(email)) {
      setError("Invalid email");
      return;
    }

    try {
      const response = await axiosInstance.put("/edit-user/" + userInfo._id, {
        email,
        password,
        fullName,
        age,
        phone,
        address,
      });

      if (response.data && response.data.user) {
        showToastMessage("User Edited Successfully", "edit");
        setTimeout(() => {
          navigate("/");
          }, 1000);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <>
      <Navbar
        userInfo={userInfo}
        onSearchCourse={onSearchCourse}
        handleClearSearch={handleClearSearch}
      />

<div className="flex items-center justify-center mt-28">
      <div className="w-96 border border-gray-300 rounded-lg bg-white px-7 py-10 shadow-lg">
        <form onSubmit={handleEditUser}>
          <h4 className="text-3xl text-center underline mb-7 font-semibold">Edit User</h4>

          <input
            type="text"
            placeholder="Email"
            className="input-box text-lg mb-4 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <PasswordInput
            placeholder="Password"
            className="mb-4 text-lg w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="text"
            placeholder="Full Name"
            className="input-box text-lg mb-4 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Age"
            className="input-box text-lg mb-4 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />

          <input
            type="text"
            placeholder="Phone"
            className="input-box text-lg mb-4 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            type="text"
            placeholder="Address"
            className="input-box text-lg mb-4 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

          <button
            type="submit"
            className="btn-primary text-lg w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Save
          </button>
        </form>
      </div>
    </div>
      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </>
  );
};

export default Edit;
