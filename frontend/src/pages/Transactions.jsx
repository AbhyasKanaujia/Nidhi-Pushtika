import React from "react";
import { Spin } from "antd";
import useTransactions from "../hooks/useTransactions";
import TransactionList from "../components/TransactionList";
import TransactionTable from "../components/TransactionTable.jsx";
import { Typography } from "antd";
import SummaryStrip from "../components/SummaryStrip";
import ErrorPlaceholder from "../components/ErrorPlaceholder.jsx";

const { Title } = Typography;

export default function Transactions() {
  const { transactions, loading, error, filters, setFilters } = useTransactions();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorPlaceholder
        message="Failed to load transactions."
        subMessage={error.message || "Unknown error"}
      />
    );
  }

  return (
    <div className="p-4 max-w-full overflow-x-hidden">
      <div className="mt-4">
        <Title level={2}>Transactions</Title>
      </div>
      {/* Summary strip showing totals based on current filters */}
      <SummaryStrip filters={filters} />
      <TransactionList transactions={transactions} setFilters={setFilters} />
      <TransactionTable transactions={transactions} />

    </div>
  );
}
