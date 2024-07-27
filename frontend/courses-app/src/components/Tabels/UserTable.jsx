import React from "react";

const UserTable = ({ users, onDeleteUser, onEditUser }) => {
  return (
    <table className="min-w-full bg-white">
      <thead className="bg-gray-800 text-white">
        <tr>
          <th className="w-1/4 py-2">Name</th>
          <th className="w-1/4 py-2">Email</th>
          <th className="w-1/4 py-2">Role</th>
          <th className="w-1/4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody className="text-gray-700 font-bold text-center">
        {users.map((user) => (
          <tr key={user._id}>
            <td className="py-2">{user.fullName}</td>
            <td className="py-2">{user.email}</td>
            <td className="py-2">{user.role}</td>
            <td className="py-2">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                onClick={() => onEditUser(user)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => onDeleteUser(user._id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;
