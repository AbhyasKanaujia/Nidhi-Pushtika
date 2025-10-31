import React from "react";
import {formatCurrency} from "../utils/formatCurrency";
import {TypographyH2, TypographyH3, TypographyP} from "@/components/ui/typography/index.jsx";
import {Card} from "./ui/card";
import {Loader} from "@/components/ui/loader.jsx"

function formatDate(dateStr) {
  const options = {year: "numeric", month: "long", day: "numeric"};
  return new Date(dateStr).toLocaleDateString("en-IN", options);
}

export default function TransactionList({transactions, loading}) {
  // Group transactions by date
  const grouped = transactions.reduce((acc, txn) => {
    const date = formatDate(txn.date);
    if (!acc[date]) acc[date] = [];
    acc[date].push(txn);
    return acc;
  }, {});

  return (<Card className="md:w-md mt-4 mx-auto bg-white p-4 gap-0">
    {loading ? <Loader message="Listing Transactions..."/> : (<>
        <TypographyH2 level={3}>Transaction List</TypographyH2>
        {Object.entries(grouped).map(([date, txns]) => (<div key={date}>
          <TypographyH3 className="sticky top-0">
            {date}
          </TypographyH3>
          {txns.map((txn) => (<div
            key={txn._id}
            className="flex justify-between items-center p-2 border-b border-gray-100 my-2 hover:border-gray-300 rounded-lg hover:shadow-xs transition-shadow bg-white"
          >
            <div className="flex-grow max-w-full">
              <TypographyP className="text-base font-medium mt-0 truncate">
                {txn.note}
              </TypographyP>
            </div>
            <div
              className={`ml-4 font-semibold text-right flex-shrink-0 ${txn.type.toLowerCase() === "income" ? "text-green-600" : "text-red-600"}`}
            >
              {formatCurrency(txn.amount)}
            </div>
          </div>))}
        </div>))}
        <TypographyP className="text-center text-gray-500 text-xs border-b border-gray-400 border-dotted pb-2 mt-0">
          End of Transactions
        </TypographyP>
      </>)}
  </Card>);
}
