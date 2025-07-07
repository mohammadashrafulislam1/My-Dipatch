import React from "react";
import { FaWallet, FaPlusCircle, FaMinusCircle, FaMoneyBillWave } from "react-icons/fa";

const Wallet = () => {
  // Sample transaction data
  const transactions = [
    { id: 1, type: "Add", amount: 50, date: "2025-07-06", status: "Success" },
    { id: 2, type: "Withdraw", amount: 30, date: "2025-07-04", status: "Success" },
    { id: 3, type: "Add", amount: 100, date: "2025-07-02", status: "Pending" },
  ];

  const balance = 120; // You can replace this with dynamic data later

  return (
    <div className="min-h-screen bg-[#f9fafb] px-6 py-10">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-6">
        {/* Wallet Header */}
        <div className="flex items-center gap-4 mb-8">
          <FaWallet className="text-4xl text-blue-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-800">Wallet Balance</h1>
            <p className="text-2xl text-green-600 font-semibold">${balance.toFixed(2)}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
            <FaPlusCircle /> Add Money
          </button>
          <button className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition">
            <FaMinusCircle /> Withdraw
          </button>
        </div>

        {/* Transaction History */}
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Transaction History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="py-2 px-4">Date</th>
                <th className="py-2 px-4">Type</th>
                <th className="py-2 px-4">Amount</th>
                <th className="py-2 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn.id} className="border-t">
                  <td className="py-2 px-4">{txn.date}</td>
                  <td className="py-2 px-4">{txn.type}</td>
                  <td className={`py-2 px-4 font-semibold ${txn.type === "Add" ? "text-green-600" : "text-red-500"}`}>
                    {txn.type === "Add" ? "+" : "-"}${txn.amount.toFixed(2)}
                  </td>
                  <td className="py-2 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        txn.status === "Success"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    No transactions yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
