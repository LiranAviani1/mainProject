import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Toast from "../../components/ToastMessage/Toast";
import Navbar from "../../components/Navbar/Navbar";
import { FaCcVisa, FaCcMastercard, FaCreditCard, FaCcAmex } from "react-icons/fa";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo, courseDetails } = location.state;
  const [cardType, setCardType] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [ID, setID] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const validateInputs = () => {
    const idRegex = /^\d{9}$/;
    const cardNumberRegex = /^\d{16}$/;
    const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    const cvvRegex = /^\d{3}$/;

    if (!cardType) {
      showToastMessage("Please select a card type", "error");
      return false;
    }
    if (!idRegex.test(ID)) {
      showToastMessage("Identification number must be exactly 9 digits", "error");
      return false;
    }
    if (!cardNumberRegex.test(cardNumber)) {
      showToastMessage("Card number must be exactly 16 digits", "error");
      return false;
    }
    if (!expiryDateRegex.test(expiryDate)) {
      showToastMessage("Expiry date must be in MM/YY format", "error");
      return false;
    }
    if (!cvvRegex.test(cvv)) {
      showToastMessage("CVV must be exactly 3 digits", "error");
      return false;
    }

    return true;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setIsProcessing(true);
    try {
      // Simulate payment process
      setTimeout(async () => {
        // Payment successful, now register the user
        const response = await axiosInstance.put(
          "/register-course/" + courseDetails._id,
          {
            userId: userInfo._id,
          }
        );

        if (response.data.error === false) {
          showToastMessage("Successfully registered", "add");
          setTimeout(() => {
            navigate("/");
          }, 1000);
        } else {
          showToastMessage(response.data.message, "error");
        }
        setIsProcessing(false);
      }, 2000); // Simulate 2 seconds payment processing time
    } catch (error) {
      setIsProcessing(false);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        showToastMessage(error.response.data.message, "error");
      } else {
        showToastMessage("An unexpected error occurred", "error");
      }
    }
  };

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

  return (
    <>
      <Navbar userInfo={userInfo} />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
          <h4 className="text-2xl font-semibold text-center mb-6">
            Enter Payment Details
          </h4>
          <form onSubmit={handlePayment}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Card Type
              </label>
              <div className="flex justify-around mb-4">
                <label className="flex flex-col items-center space-y-1">
                  <input
                    type="radio"
                    name="cardType"
                    value="visa"
                    onChange={(e) => setCardType(e.target.value)}
                    className="form-radio text-blue-500"
                  />
                  <FaCcVisa size={40} />
                  <span className="text-sm">Visa</span>
                </label>
                <label className="flex flex-col items-center space-y-1">
                  <input
                    type="radio"
                    name="cardType"
                    value="mastercard"
                    onChange={(e) => setCardType(e.target.value)}
                    className="form-radio text-blue-500"
                  />
                  <FaCcMastercard size={40} />
                  <span className="text-sm">Mastercard</span>
                </label>
                <label className="flex flex-col items-center space-y-1">
                  <input
                    type="radio"
                    name="cardType"
                    value="isracard"
                    onChange={(e) => setCardType(e.target.value)}
                    className="form-radio text-blue-500"
                  />
                  <FaCreditCard size={40} />
                  <span className="text-sm">Isracard</span>
                </label>
                <label className="flex flex-col items-center space-y-1">
                  <input
                    type="radio"
                    name="cardType"
                    value="amex"
                    onChange={(e) => setCardType(e.target.value)}
                    className="form-radio text-blue-500"
                  />
                  <FaCcAmex size={40} />
                  <span className="text-sm">American Express</span>
                </label>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Identification Number
              </label>
              <input
                type="text"
                placeholder="Identification Number"
                value={ID}
                onChange={(e) => setID(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Card Number
              </label>
              <input
                type="text"
                placeholder="Card Number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Expiry Date
              </label>
              <input
                type="text"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                CVV
              </label>
              <input
                type="text"
                placeholder="CVV"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className={`w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 ${
                isProcessing ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Pay and Register"}
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

export default PaymentPage;
