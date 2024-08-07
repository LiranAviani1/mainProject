import React from "react";

const TeacherApplicationsTable = ({ applications, onApprove, onDeny, onView }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border rounded-lg shadow-lg">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="w-1/5 py-3 px-4 border-b text-sm font-semibold text-center">Full Name</th>
            <th className="w-1/5 py-3 px-4 border-b text-sm font-semibold text-center">Email</th>
            <th className="w-1/5 py-3 px-4 border-b text-sm font-semibold text-center">Phone</th>
            <th className="w-1/5 py-3 px-4 border-b text-sm font-semibold text-center">Status</th>
            <th className="w-1/5 py-3 px-4 border-b text-sm font-semibold text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 font-bold text-center">
          {applications.map((app) => (
            <tr key={app._id} className="hover:bg-gray-100 transition-colors duration-200">
              <td className="py-3 px-4 border-b text-center">{app.fullName}</td>
              <td className="py-3 px-4 border-b text-center">{app.email}</td>
              <td className="py-3 px-4 border-b text-center">{app.phone}</td>
              <td className="py-3 px-4 border-b text-center">
                {app.status === "approved" && (
                  <span className="text-green-600 font-semibold">Approved</span>
                )}
                {app.status === "pending" && (
                  <span className="text-red-600 font-semibold">Pending</span>
                )}
              </td>
              <td className="py-3 px-4 border-b flex justify-center space-x-2">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition duration-300"
                  onClick={() => onView(app)}
                >
                  View
                </button>
                {app.status === "pending" && (
                  <>
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition duration-300"
                      onClick={() => onApprove(app._id)}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-300"
                      onClick={() => onDeny(app._id)}
                    >
                      Deny
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherApplicationsTable;
