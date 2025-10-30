import React from "react";
import { Spin } from "antd";
import useTransactions from "../hooks/useTransactions";
import TransactionList from "../components/TransactionList";
import TransactionTable from "../components/TransactionTable.jsx";
import { Typography } from "antd";

const { Title } = Typography;

export default function Transactions() {
  const { transactions, loading, error } = useTransactions();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        Error loading transactions: {error.message || "Unknown error"}
      </div>
    );
  }

  return (
    <div className="p-4 max-w-full overflow-x-hidden">
      <div className="mt-4">
        <Title level={2}>Transactions</Title>
      </div>
      <TransactionList transactions={transactions}/>
      <TransactionTable transactions={transactions}/>

    </div>
  );
}
