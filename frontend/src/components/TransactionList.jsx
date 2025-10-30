import React from "react";
import {formatCurrency} from "../utils/formatCurrency";
import {Typography} from "antd";

const {Title} = Typography;

function formatDate(dateStr) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateStr).toLocaleDateString("en-IN", options);
}

export default function TransactionList({ transactions }) {
  // Group transactions by date
  const grouped = transactions.reduce((acc, txn) => {
    const date = formatDate(txn.date);
    if (!acc[date]) acc[date] = [];
    acc[date].push(txn);
    return acc;
  }, {});

  return (
    <div className="md:w-md mt-4 mx-auto bg-white">
      <Title level={3}>Transaction List</Title>
      {Object.entries(grouped).map(([date, txns]) => (
        <div key={date}>
          <h2 className="sticky top-0 bg-white text-lg font-semibold mb-2 border-b border-gray-300 py-1">
            {date}
          </h2>
          <div>
            {txns.map((txn) => (
              <div
                key={txn._id}
                className="flex justify-between items-center p-2 border-b border-gray-100 my-2 hover:border-gray-300 rounded-lg hover:shadow-xs transition-shadow bg-white"
              >
                <div className="flex-1">
                  <p className="text-base font-medium">{txn.note}</p>
                </div>
                <div
                  className={`ml-4 font-semibold text-right ${
                    txn.type.toLowerCase() === "income"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {formatCurrency(txn.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <p className="text-center text-gray-500 text-xs mb-4 border-b border-gray-400 border-dotted py-2">End of Transactions</p>
    </div>
  );
}
