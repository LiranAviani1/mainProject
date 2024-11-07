import React, { useMemo, useState } from "react";

const PurchaseTable = ({ purchases }) => {
  const [isSummaryVisible, setIsSummaryVisible] = useState(false);

  // Calculate statistics using useMemo to avoid recalculations on re-renders
  const { totalCost, bestCourses, topSpenders, mostPopularCourses } = useMemo(() => {
    let totalCost = 0;
    let courseRevenue = {};
    let userSpending = {};
    let courseBuyersCount = {};

    purchases.forEach((purchase) => {
      totalCost += purchase.cost;
      const courseName = purchase.courseId.title;
      courseRevenue[courseName] = (courseRevenue[courseName] || 0) + purchase.cost;

      if (!courseBuyersCount[courseName]) {
        courseBuyersCount[courseName] = new Set();
      }
      courseBuyersCount[courseName].add(purchase.userId._id);

      const userName = purchase.userId.fullName;
      userSpending[userName] = (userSpending[userName] || 0) + purchase.cost;
    });

    const maxRevenue = Math.max(...Object.values(courseRevenue));
    const bestCourses = Object.keys(courseRevenue).filter(
      (course) => courseRevenue[course] === maxRevenue
    );

    const maxSpending = Math.max(...Object.values(userSpending));
    const topSpenders = Object.keys(userSpending).filter(
      (user) => userSpending[user] === maxSpending
    );

    const maxBuyers = Math.max(...Object.values(courseBuyersCount).map((set) => set.size));
    const mostPopularCourses = Object.keys(courseBuyersCount).filter(
      (course) => courseBuyersCount[course].size === maxBuyers
    );

    return { totalCost, bestCourses, topSpenders, mostPopularCourses };
  }, [purchases]);

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
        <span className="text-lg font-semibold text-gray-700">Total Cost:</span>
        <div>
        <span className="text-lg font-bold text-gray-900">₪{totalCost}</span>
        </div>
      </div>
      
      <div className="border-b pb-2">
        <span className="text-lg font-semibold text-gray-700">Best Courses (by Revenue):</span>
        <div className="mt-2 space-y-1 text-lg text-gray-900">
          {bestCourses.map((course, index) => (
            <div key={index} className="font-medium">{course}</div>
          ))}
        </div>
      </div>
      
      <div className="border-b pb-2">
        <span className="text-lg font-semibold text-gray-700">Most Popular Courses (by Buyers):</span>
        <div className="mt-2 space-y-1 text-lg text-gray-900">
          {mostPopularCourses.map((course, index) => (
            <div key={index} className="font-medium">{course}</div>
          ))}
        </div>
      </div>
      
      <div>
        <span className="text-lg font-semibold text-gray-700">Top Spenders:</span>
        <div className="mt-2 space-y-1 text-lg text-gray-900">
          {topSpenders.map((spender, index) => (
            <div key={index} className="font-medium">{spender}</div>
          ))}
        </div>
      </div>
    </div>
  </div>
)}


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
    </div>
  );
};

export default PurchaseTable;
