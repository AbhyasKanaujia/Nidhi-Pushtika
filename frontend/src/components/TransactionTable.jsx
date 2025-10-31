import React from "react";
import {formatCurrency} from "../utils/formatCurrency";
import {TypographyH2} from "@/components/ui/typography/index.jsx";
import {Card} from "@/components/ui/card.jsx";
import {Loader} from "@/components/ui/loader.jsx";

export default function TransactionTable({transactions, loading}) {
  return (<Card className="overflow-x-scroll mt-4 px-4">
    {loading ? <Loader message="Creating Table..."/> : (<div className="px-4">
      <TypographyH2 level={3}>Transaction Table</TypographyH2>
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
        <tr>
          <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Note</th>
          <th className="border border-gray-300 px-4 py-2 text-right">Income</th>
          <th className="border border-gray-300 px-4 py-2 text-right">Expense</th>
        </tr>
        </thead>
        <tbody>
        {transactions.length === 0 ? (<tr>
          <td colSpan="4" className="text-center p-4">
            No transactions found.
          </td>
        </tr>) : (transactions.map((txn) => (<tr key={txn._id} className="hover:bg-gray-50">
          <td className="border border-gray-300 px-4 py-2">
            {new Date(txn.date).toLocaleDateString()}
          </td>
          <td className="border border-gray-300 px-4 py-2">{txn.note}</td>
          <td
            className={`border border-gray-300 px-4 py-2 text-right ${txn.type.toLowerCase() === "income" ? "text-green-600" : ""}`}>
            {txn.type.toLowerCase() === "income" ? formatCurrency(txn.amount) : ""}
          </td>
          <td
            className={`border border-gray-300 px-4 py-2 text-right ${txn.type.toLowerCase() === "expense" ? "text-red-600" : ""}`}>
            {txn.type.toLowerCase() === "expense" ? formatCurrency(txn.amount) : ""}
          </td>
        </tr>)))}
        </tbody>
      </table>
    </div>)}

  </Card>);
}
