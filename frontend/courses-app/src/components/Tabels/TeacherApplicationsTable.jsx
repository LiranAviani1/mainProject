import React from "react";

const TeacherApplicationsTable = ({ applications, onApprove, onDeny }) => {
  return (
    <table className="min-w-full bg-white">
      <thead className="bg-gray-800 text-white">
        <tr>
          <th className="py-2">Full Name</th>
          <th className="py-2">Email</th>
          <th className="py-2">Phone</th>
          <th className="py-2">Qualifications</th>
          <th className="py-2">Experience</th>
          <th className="py-2">Status</th>
          <th className="py-2">Actions</th>
        </tr>
      </thead>
      <tbody className="text-gray-700 text-center">
        {applications.map((app) => (
          <tr key={app._id} className="border-b border-gray-300">
            <td className="py-2">{app.fullName}</td>
            <td className="py-2">{app.email}</td>
            <td className="py-2">{app.phone}</td>
            <td className="py-2">{app.qualifications}</td>
            <td className="py-2">{app.experience}</td>
            <td className="py-2">{app.status}</td>
            <td className="py-2 flex justify-center space-x-2">
              {app.status === "pending" && (
                <>
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={() => onApprove(app._id)}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={() => onDeny(app._id)}
                  >
                    Deny
                  </button>
                </>
              )}
              {app.status === "approved" && (
                <span className="text-green-600 font-semibold">Approved</span>
              )}
              {app.status === "denied" && (
                <span className="text-red-600 font-semibold">Denied</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TeacherApplicationsTable;
