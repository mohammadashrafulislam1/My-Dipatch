import React, { useEffect, useState } from "react";
import { FaWallet, FaPlusCircle, FaMinusCircle } from "react-icons/fa";
import axios from "axios";
import useAuth from "../../../Components/useAuth";
import { endPoint } from "../../../Components/ForAPIs";

const API = `${endPoint}/wallet`; // UPDATE THIS

const Wallet = () => {
  const { user } = useAuth(); 
  const userId = user?._id;

  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  // Fetch wallet + transactions
  const loadWallet = async () => {
    try {
      const walletRes = await axios.get(`${API}/${userId}`);
      setBalance(walletRes.data.balance);

      const txnRes = await axios.get(`${API}/transactions/${userId}`);
      setTransactions(txnRes.data);

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) loadWallet();
  }, [userId]);

  // Add Money
  const handleAddMoney = async () => {
    try {
      await axios.post(`${API}/add`, { userId, amount: Number(amount) });

      setShowAddModal(false);
      setAmount("");
      loadWallet(); // refresh data
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Error adding money");
    }
  };

  // Withdraw Money
  const handleWithdraw = async () => {
    try {
      await axios.post(`${API}/withdraw`, { userId, amount: Number(amount) });

      setShowWithdrawModal(false);
      setAmount("");
      loadWallet();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Withdrawal failed");
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-lg">Loading wallet...</p>;

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6">

        {/* Wallet Header */}
        <div className="flex items-center gap-4 mb-8">
          <FaWallet className="text-4xl text-blue-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-800">Wallet Balance</h1>
            <p className="text-3xl text-green-600 font-semibold">
              ${balance.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            <FaPlusCircle /> Add Money
          </button>

          <button
            onClick={() => setShowWithdrawModal(true)}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            <FaMinusCircle /> Withdraw
          </button>
        </div>

        {/* Transaction History */}
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Transaction History
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="py-2 px-4">Date</th>
                <th className="py-2 px-4">Type</th>
                <th className="py-2 px-4">Amount</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((txn) => (
                <tr key={txn._id} className="border-t">
                  <td className="py-2 px-4">
                    {new Date(txn.createdAt).toLocaleDateString()}
                  </td>

                  <td className="py-2 px-4 capitalize">{txn.type}</td>

                  <td
                    className={`py-2 px-4 font-semibold ${
                      txn.type === "add" ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {txn.type === "add" ? "+" : "-"}${txn.amount}
                  </td>
                </tr>
              ))}

              {transactions.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-500">
                    No transactions yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD MONEY MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-80 shadow-lg">
            <h2 className="text-lg font-bold mb-3">Add Money</h2>
            <input
              type="number"
              className="border w-full px-3 py-2 rounded-md mb-4"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button
              onClick={handleAddMoney}
              className="w-full bg-blue-600 text-white py-2 rounded-md"
            >
              Confirm
            </button>
            <button
              onClick={() => setShowAddModal(false)}
              className="w-full mt-2 text-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* WITHDRAW MODAL */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-80 shadow-lg">
            <h2 className="text-lg font-bold mb-3">Withdraw</h2>
            <input
              type="number"
              className="border w-full px-3 py-2 rounded-md mb-4"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button
              onClick={handleWithdraw}
              className="w-full bg-red-600 text-white py-2 rounded-md"
            >
              Confirm
            </button>
            <button
              onClick={() => setShowWithdrawModal(false)}
              className="w-full mt-2 text-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
