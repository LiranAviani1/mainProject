import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import PasswordInput from "../../components/Input/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

const SignUp = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name) {
      setError("Please enter your name");
      return;
    } else if (name.length < 2) {
      setError("Name should be at least 2 characters long");
      return;
    }

    if (!age) {
      setError("Please enter your age");
      return;
    } else if (age > 100) {
      setError("Please enter a valid age");
      return;
    }

    if (!phone) {
      setError("Please enter your phone number");
      return;
    } else if (phone.length !== 10) {
      setError("Please enter a valid phone number");
      return;
    }

    if (!address) {
      setError("Please enter your address");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter the password");
      return;
    } else if (password.length < 6 && password.length > 20) {
      setError("Password should be between 6 to 20 characters long");
      return;
    } else if (!password.match(/[a-z]/g) || !password.match(/[A-Z]/g) || !password.match(/[0-9]/g)) {
      setError("Password should contain at least one uppercase, one lowercase, and one number");
      return;
    }

    setError("");

    // SignUp API Call

    try {
      const response = await axiosInstance.post("/create-account", {
        fullName: name,
        age: age,
        phone: phone,
        address: address,
        email: email,
        password: password,
      });

      // Handle successful registration response
      if (response.data && response.data.error) {
        setError(response.data.message);
        return;
      }

      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      // Handle login error
      if (error.response && error.response.data && error.response.data.message) {
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
        <div className="w-full max-w-md bg-white border border-gray-300 rounded-lg shadow-lg p-8">
          <form onSubmit={handleSignUp}>
            <h4 className="text-3xl font-semibold mb-7 text-center">Sign Up</h4>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                type="text"
                placeholder="Age"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />

              <input
                type="text"
                placeholder="Phone"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <input
                type="text"
                placeholder="Address"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

            <button type="submit" className="w-full py-3 mt-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300">
              Create Account
            </button>

            <p className="text-sm text-center mt-4">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-gray-700 underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
