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
      <Navbar />

      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handleEditUser}>
            <h4 className="text-2xl mb-7">Edit User</h4>

            <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              type="text"
              placeholder="FullName"
              className="input-box"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Age"
              className="input-box"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />

            <input
              type="text"
              placeholder="Phone"
              className="input-box"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <input
              type="text"
              placeholder="Address"
              className="input-box"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

            <button type="submit" className="btn-primary">
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
