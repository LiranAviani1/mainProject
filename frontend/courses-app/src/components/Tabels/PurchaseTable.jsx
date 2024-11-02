import React, { useMemo } from "react";

const PurchaseTable = ({ purchases }) => {
  // Calculate statistics using useMemo to avoid recalculations on re-renders
  const { totalCost, bestCourse, topSpender, mostPopularCourse } = useMemo(() => {
    let totalCost = 0;
    let courseRevenue = {};
    let userSpending = {};
    let courseBuyersCount = {};

    purchases.forEach((purchase) => {
      // Update total cost
      totalCost += purchase.cost;

      // Update course revenue
      const courseName = purchase.courseId.title;
      courseRevenue[courseName] = (courseRevenue[courseName] || 0) + purchase.cost;

      // Count unique buyers for each course
      if (!courseBuyersCount[courseName]) {
        courseBuyersCount[courseName] = new Set();
      }
      courseBuyersCount[courseName].add(purchase.userId._id);

      // Update user spending
      const userName = purchase.userId.fullName;
      userSpending[userName] = (userSpending[userName] || 0) + purchase.cost;
    });

    // Find the best course by revenue
    const bestCourse = Object.keys(courseRevenue).reduce((a, b) =>
      courseRevenue[a] > courseRevenue[b] ? a : b
    );

    // Find the top spender
    const topSpender = Object.keys(userSpending).reduce((a, b) =>
      userSpending[a] > userSpending[b] ? a : b
    );

    // Find the course with the most unique buyers
    const mostPopularCourse = Object.keys(courseBuyersCount).reduce((a, b) =>
      courseBuyersCount[a].size > courseBuyersCount[b].size ? a : b
    );

    return { totalCost, bestCourse, topSpender, mostPopularCourse };
  }, [purchases]);

  return (
    <div>
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
                <td className="py-3 px-4 border-b text-center" colSpan="4">
                  No purchases found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Styled Summary section */}
      <div className="mt-6 p-6 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg shadow-lg flex flex-col space-y-4">
        <h3 className="text-3xl font-bold text-gray-800 text-center underline mb-4">Summary</h3>
        <div className="flex justify-between items-center border-b pb-2">
          <span className="text-xl font-semibold text-gray-700">Total Cost:</span>
          <span className="text-xl font-bold text-blue-600">₪{totalCost}</span>
        </div>
        <div className="flex justify-between items-center border-b pb-2">
          <span className="text-xl font-semibold text-gray-700">Best Course (by Revenue):</span>
          <span className="text-xl font-bold text-blue-600">{bestCourse}</span>
        </div>
        <div className="flex justify-between items-center border-b pb-2">
          <span className="text-xl font-semibold text-gray-700">Most Popular Course (by Buyers):</span>
          <span className="text-xl font-bold text-blue-600">{mostPopularCourse}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xl font-semibold text-gray-700">Top Spender:</span>
          <span className="text-xl font-bold text-blue-600">{topSpender}</span>
        </div>
      </div>
    </div>
  );
};

export default PurchaseTable;
