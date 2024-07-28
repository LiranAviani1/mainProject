import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import PasswordInput from "../../components/Input/PasswordInput";
import axiosInstance from "../../utils/axiosInstance";
import { validateEmail } from "../../utils/helper";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saveEmail, setSaveEmail] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Check if a valid token exists in local storage for automatic login
    const token = localStorage.getItem("token");
    if (token) {
      // Optionally, verify token validity with an API call
      navigate('/dashboard');
    }

    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setSaveEmail(true);
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter the password");
      return;
    }

    setError("");

    try {
      const response = await axiosInstance.post("/login", {
        email: email,
        password: password,
      });

      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);

        if (saveEmail) {
          localStorage.setItem("savedEmail", email);
        } else {
          localStorage.removeItem("savedEmail");
        }

        navigate('/dashboard');
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
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl font-semibold text-center mb-6 underline">Login</h4>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={saveEmail}
                onChange={(e) => setSaveEmail(e.target.checked)}
                className="mr-2"
              />
              <label className="text-sm">Remember Email</label>
            </div>

            {error && <p className="text-red-500 text-sm pb-2">{error}</p>}

            <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300">Login</button>

            <p className="text-sm text-center mt-4 text-gray-600">
              Not registered yet? <Link to='/signUp' className="font-medium text-blue-500 hover:underline">Create an Account</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
