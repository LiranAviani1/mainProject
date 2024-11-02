import React from "react";

const PurchaseTable = ({ purchases }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border rounded-lg shadow-lg">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="w-1/4 py-3 px-4 text-center">User Name</th>
            <th className="w-1/4 py-3 px-4 text-center">Course Name</th>
            <th className="w-1/4 py-3 px-4 text-center">Date of Purchase</th>
            <th className="w-1/4 py-3 px-4 text-center">Cost</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 font-semibold">
          {purchases.length > 0 ? (
            purchases.map((purchase) => (
              <tr
                key={purchase._id}
                className="hover:bg-gray-100 transition-colors duration-200"
              >
                <td className="py-3 px-4 border-b text-center">
                  {purchase.userId.fullName}
                </td>
                <td className="py-3 px-4 border-b text-center">
                  {purchase.courseId.title}
                </td>
                <td className="py-3 px-4 border-b text-center">
                  {new Date(purchase.datePurchase).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 border-b text-center">
                  ₪{purchase.cost}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                className="py-3 px-4 border-b text-center"
                colSpan="4"
              >
                No purchases found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PurchaseTable;
