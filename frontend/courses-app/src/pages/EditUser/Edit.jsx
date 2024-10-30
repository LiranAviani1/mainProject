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
 

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Ensure the date is in YYYY-MM-DD format
  };

  const [fullName, setFullName] = useState(userInfo.fullName || "");
  const [age, setAge] = useState(userInfo.age || "");
  const [phone, setPhone] = useState(userInfo.phone || "");
  const [address, setAddress] = useState(userInfo.address || "");
  const [email, setEmail] = useState(userInfo.email || "");
  const [password, setPassword] = useState(userInfo.password || "");
  const [birthday, setBirthday] = useState(userInfo.birthday ? formatDate(userInfo.birthday) : "");
  const [gender, setGender] = useState(userInfo.gender || "");
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
      
      const response = await axiosInstance.put(`/edit-user/${userInfo._id}`, {
        email,
        password: password !== userInfo.password ? password : undefined, 
        fullName,
        age,
        phone,
        address,
        birthday,
        gender,
      });
  
      if (response.data && response.data.user) {
        showToastMessage("User Edited Successfully", "edit");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
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

      <div className="flex items-center justify-center mt-20">
        <div className="w-full max-w-lg border border-gray-300 rounded-lg bg-white px-8 py-10 shadow-lg">
          <form onSubmit={handleEditUser}>
            <h4 className="text-2xl text-center mb-8 font-semibold underline">Edit User</h4>

            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input
                  type="text"
                  className="text-lg w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <PasswordInput
                  className="text-lg w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  className="text-lg w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">Age</label>
                <input
                  type="text"
                  className="text-lg w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="text"
                  className="text-lg w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  className="text-lg w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">Birthday</label>
                <input
                  type="date"
                  className="text-lg w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">Gender</label>
                <select
                  className="text-lg w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {error && <p className="text-red-500 text-xs">{error}</p>}

              <button
                type="submit"
                className="w-full mt-4 bg-blue-500 text-white text-lg px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
              >
                Save
              </button>
            </div>
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
