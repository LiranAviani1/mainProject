import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faPhone, faFileAlt, faImage } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../components/Navbar/Navbar";
import axiosInstance from "../../utils/axiosInstance";
import Toast from "../../components/ToastMessage/Toast";
import { useNavigate } from "react-router-dom";

const ApplyTeacher = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [experience, setExperience] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState('');
  const [applicationId, setApplicationId] = useState('');
  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: '',
    type: 'add',
  });

  const navigate = useNavigate();

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
      message: '',
    });
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && !['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      setFileError('Only image files are allowed (jpeg, png, gif)');
      setFile(null);
    } else {
      setFileError(null);
      setFile(file);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/gif': [] },
  });

  const handleApply = async (e) => {
    e.preventDefault();

    if (!fullName || !email || !phone || !experience || !qualifications || !file) {
      setError('Please fill all fields and upload a file.');
      return;
    }

    setError('');

    try {
      const token = localStorage.getItem("token"); // Get token from local storage
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("experience", experience);
      formData.append("qualifications", qualifications);
      formData.append("file", file);

      const response = await axiosInstance.post('/apply-teacher', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data && !response.data.error) {
        showToastMessage('Application submitted successfully!', 'success');
        setFullName('');
        setEmail('');
        setPhone('');
        setExperience('');
        setQualifications('');
        setFile(null);
        navigate('/');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const handleCancelApplication = async () => {
    try {
      const response = await axiosInstance.delete(`/delete-application/${userInfo._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data && !response.data.error) {
        showToastMessage('Application canceled successfully!', 'success');
        setApplicationStatus('');
        setApplicationId('');
      }
    } catch (error) {
      showToastMessage('An error occurred while canceling the application. Please try again.', 'error');
    }
  };

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);

        // Check application status
        const applicationResponse = await axiosInstance.get(`/get-application-status/${response.data.user._id}`);
        if (applicationResponse.data && applicationResponse.data.status) {
          setApplicationStatus(applicationResponse.data.status);
          setApplicationId(applicationResponse.data.applicationId); // Set the application ID
        }
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    getUserInfo();
    return () => {};
  }, []);

  return (
    <>
      <Navbar
        userInfo={userInfo}
      />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
          {userInfo && userInfo.role === "teacher" ? (
            <div className="text-center font-semibold text-red-500 text-lg">
              You are already a teacher and cannot apply again!
            </div>
          ) : applicationStatus === "pending" ? (
            <div className="text-center font-semibold text-red-500 text-lg">
              Your application is pending. You cannot apply again at this time.
              <div><button onClick={handleCancelApplication} className="mt-4 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300">Cancel Application</button></div>
            </div>
          ) : (
            <form onSubmit={handleApply}>
              <h4 className="text-2xl font-semibold text-center mb-6 underline">Apply to be a Teacher</h4>

              <div className="mb-4 relative">
                <FontAwesomeIcon icon={faUser} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="mb-4 relative">
                <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-4 relative">
                <FontAwesomeIcon icon={faPhone} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Phone"
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="mb-4 relative">
                <FontAwesomeIcon icon={faFileAlt} className="absolute left-3 top-3 text-gray-400" />
                <textarea
                  placeholder="Experience"
                  className="w-full h-32 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                />
              </div>

              <div className="mb-4 relative">
                <FontAwesomeIcon icon={faFileAlt} className="absolute left-3 top-3 text-gray-400" />
                <textarea
                  placeholder="Qualifications"
                  className="w-full h-32 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={qualifications}
                  onChange={(e) => setQualifications(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <div {...getRootProps({ className: "dropzone" })} className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer">
                  <input {...getInputProps()} />
                  {file ? (
                    <p>{file.name}</p>
                  ) : (
                    <p><FontAwesomeIcon icon={faImage} className="text-gray-400 mr-2" />Drag and drop an image here, or click to select an image</p>
                  )}
                </div>
                {fileError && <p className="text-red-500 text-sm mt-2">{fileError}</p>}
              </div>

              {error && <p className="text-red-500 text-sm pb-2">{error}</p>}

              <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300">Apply</button>
            </form>
          )}
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

export default ApplyTeacher;
