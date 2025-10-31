import React from "react";
import useTransactions from "../hooks/useTransactions";
import TransactionList from "../components/TransactionList";
import TransactionTable from "../components/TransactionTable.jsx";
import SummaryStrip from "../components/SummaryStrip";
import ErrorPlaceholder from "../components/ErrorPlaceholder.jsx";
import {TypographyH1} from "@/components/ui/typography/index.jsx";
import {Loader} from "../components/ui/loader.jsx";

export default function Transactions() {
  const {transactions, loading, error, filters, setFilters} = useTransactions();

  if (error) {
    return (<ErrorPlaceholder
      message="Failed to load transactions."
      subMessage={error?.message || "Unknown error"}
    />);
  }

  return (<div className="py-4 max-w-full overflow-x-hidden">
    <div>
      <TypographyH1>Transactions</TypographyH1>
    </div>
    <SummaryStrip filters={filters}/>
    <TransactionList transactions={transactions} loading={loading}/>
    <TransactionTable transactions={transactions} loading={loading}/>

  </div>);
}
