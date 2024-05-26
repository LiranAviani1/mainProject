import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import PasswordInput from "../../components/Input/PasswordInput";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

const Edit = () => {
  const [user, setUser] = useState();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleEditUser = async (e) => {
    e.preventDefault();
    

    if (!validateEmail(email)) {
      setError("Invalid email");
      return;
    }

    try {
      const response = await axiosInstance.put("/edit-user/" + "6650e5d950b954423a122668", {
        email,
        password,
        name,
        age,
        phone,
        address,
      });

      if (response.data && response.data.user) {
        navigate("/");
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
              placeholder="Name"
              className="input-box"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
    </>
  );
};

export default Edit;
