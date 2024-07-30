import React, { useState, useEffect } from "react";
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
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState('');
  const [applicationId, setApplicationId] = useState('');
  const [isSearch, setIsSearch] = useState(false);
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

  const handleApply = async (e) => {
    e.preventDefault();
  
    if (!fullName || !email || !phone || !experience || !qualifications) {
      setError('Please fill all fields.');
      return;
    }
  
    setError('');
  
    try {
      const token = localStorage.getItem("token"); // Get token from local storage
  
      const response = await axiosInstance.post('/apply-teacher', {
        fullName,
        email,
        phone,
        experience,
        qualifications
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (response.data && !response.data.error) {
        showToastMessage('Application submitted successfully!', 'success');
        setFullName('');
        setEmail('');
        setPhone('');
        setExperience('');
        setQualifications('');
        navigate('/');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const handleCancelApplication = async () => {
    try {
      console.log(`Request to delete application with ID: ${userInfo._id}`); // Log the application ID
      const response = await axiosInstance.delete(`/delete-application/${userInfo._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log('Delete response:', response); // Log the response
      if (response.data && !response.data.error) {
        showToastMessage('Application canceled successfully!', 'success');
        setApplicationStatus('');
        setApplicationId('');
      }
    } catch (error) {
      console.error('An error occurred while canceling the application:', error); // Log the error details
      showToastMessage('An error occurred while canceling the application. Please try again.', 'error');
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
        onSearchCourse={onSearchCourse}
        handleClearSearch={handleClearSearch}
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
              <button onClick={handleCancelApplication} className="mt-4 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300">Cancel Application</button>
            </div>
          ) : (
            <form onSubmit={handleApply}>
              <h4 className="text-2xl font-semibold text-center mb-6 underline">Apply to be a Teacher</h4>

              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Phone"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <textarea
                  placeholder="Experience"
                  className="w-full h-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <textarea
                  placeholder="Qualifications"
                  className="w-full h-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={qualifications}
                  onChange={(e) => setQualifications(e.target.value)}
                />
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
