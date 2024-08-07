import React from "react";

const UserTable = ({ users, onDeleteUser, onEditUser, onChangeUserRole }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border rounded-lg shadow-lg">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="w-1/4 py-3 px-4 border-b text-sm font-semibold text-center">Full Name</th>
            <th className="w-1/4 py-3 px-4 border-b text-sm font-semibold text-center">Email</th>
            <th className="w-1/4 py-3 px-4 border-b text-sm font-semibold text-center">Role</th>
            <th className="w-1/4 py-3 px-4 border-b text-sm font-semibold text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 font-semibold text-center">
          {users.map((user) => (
            <tr key={user._id} className="hover:bg-gray-100 transition-colors duration-200">
              <td className="py-3 px-4 border-b text-center">{user.fullName}</td>
              <td className="py-3 px-4 border-b text-center">{user.email}</td>
              <td className="py-3 px-4 border-b text-center">{user.role}</td>
              <td className="py-3 px-4 border-b flex justify-center space-x-2">
                <button
                  onClick={() => onEditUser(user)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition duration-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDeleteUser(user._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-300"
                >
                  Delete
                </button>
                <button
                  onClick={() => onChangeUserRole(user._id, "user")}
                  className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600 transition duration-300"
                >
                  User
                </button>
                <button
                  onClick={() => onChangeUserRole(user._id, "teacher")}
                  className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition duration-300"
                >
                  Teacher
                </button>
                <button
                  onClick={() => onChangeUserRole(user._id, "admin")}
                  className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition duration-300"
                >
                  Admin
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
