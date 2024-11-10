import React, { useMemo, useState } from "react";
import Modal from "react-modal";

const ContactTable = ({ contacts, onDeleteMessage }) => {
  const [isSummaryVisible, setIsSummaryVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Calculate statistics using useMemo to avoid recalculations on re-renders
  const { totalMessages, uniqueSenders } = useMemo(() => {
    let totalMessages = contacts.length;
    let senders = new Set();

    contacts.forEach((contact) => {
      senders.add(contact.email);
    });

    return { totalMessages, uniqueSenders: Array.from(senders) };
  }, [contacts]);

  // Open modal and set the selected message
  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMessage(null);
  };

  return (
    <div>
      {/* Toggle Button */}
      <button
        onClick={() => setIsSummaryVisible(!isSummaryVisible)}
        className="mb-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition duration-300"
      >
        {isSummaryVisible ? "Hide Summary" : "Show Summary"}
      </button>

      {/* Professional Styled Summary section */}
      {isSummaryVisible && (
        <div className="mb-6 p-8 bg-white border border-gray-300 rounded-lg shadow-lg">
          <h3 className="text-3xl font-bold text-gray-800 text-center mb-6">Summary</h3>
          
          <div className="grid gap-4">
            <div className="border-b pb-2">
              <span className="text-lg font-semibold text-gray-700">Total Messages:</span>
              <div>
                <span className="text-lg font-bold text-gray-900">{totalMessages}</span>
              </div>
            </div>
            
            <div>
              <span className="text-lg font-semibold text-gray-700">Unique Senders:</span>
              <div className="mt-2 space-y-1 text-lg text-gray-900">
                {uniqueSenders.map((sender, index) => (
                  <div key={index} className="font-medium">{sender}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Messages Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg shadow-lg">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="w-1/4 py-3 px-4 text-center">Name</th>
              <th className="w-1/4 py-3 px-4 text-center">Email</th>
              <th className="w-1/4 py-3 px-4 text-center">Date</th>
              <th className="w-1/4 py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 font-semibold">
            {contacts.length > 0 ? (
              contacts.map((contact) => (
                <tr
                  key={contact._id}
                  className="hover:bg-gray-100 transition-colors duration-200"
                >
                  <td className="py-3 px-4 border-b text-center">
                    {contact.name}
                  </td>
                  <td className="py-3 px-4 border-b text-center">
                    {contact.email}
                  </td>
                  <td className="py-3 px-4 border-b text-center">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 border-b text-center flex justify-center space-x-2">
                    <button
                      onClick={() => handleViewMessage(contact)}
                      className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onDeleteMessage(contact._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-3 px-4 border-b text-center" colSpan="5">
                  No messages found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Full Message View */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="View Message"
        className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto border border-gray-300"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        {selectedMessage && (
          <div className="space-y-4 text-gray-800">
            <h2 className="text-2xl font-bold mb-2 text-center border-b pb-2">Message Details</h2>
            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {selectedMessage.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedMessage.email}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedMessage.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Message:</strong>
              </p>
              <div className="p-4 bg-gray-100 border border-gray-200 rounded-md">
                {selectedMessage.message}
              </div>
            </div>
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition duration-300 w-full"
            >
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ContactTable;
