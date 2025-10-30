import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spin, Typography } from "antd";
import { formatCurrency } from "../utils/formatCurrency";
import { getSummary } from "../api/reportApi";

const { Text, Title } = Typography;


import { WarningOutlined } from "@ant-design/icons";
import ErrorPlaceholder from "./ErrorPlaceholder";

const SummaryStrip = ({ filters }) => {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchSummary = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await getSummary(filters);
      setSummary({
        totalIncome: data.totalIncome,
        totalExpense: data.totalExpense,
        balance: data.balance,
      });
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [filters?.from, filters?.to]);

  return (
    <div className="md:w-md mx-auto">
      <Title level={3}>Summary</Title>
      <Card className="mb-4">
        {loading ? (
          <div className="text-center py-5">
            <Spin />
          </div>
        ) : error ? (
          <ErrorPlaceholder
            message="Summary data is currently unavailable."
            subMessage="Please try again later."
          />
        ) : (
          <div className="flex flex-col md:flex-row justify-between items-center text-center">
            <div className="flex-1 border-b md:border-b-0 md:border-r border-gray-200 py-2 transition-transform duration-200 ease-in-out hover:scale-[1.03] cursor-pointer">
              <Title level={5}>Total Income</Title>
              <Text type="success" strong style={{ fontSize: "1.125rem" }}>
                {formatCurrency(summary.totalIncome)}
              </Text>
            </div>
            <div className="flex-1 border-b md:border-b-0 md:border-r border-gray-200 py-2 transition-transform duration-200 ease-in-out hover:scale-[1.03] cursor-pointer">
              <Title level={5}>Total Expense</Title>
              <Text type="danger" strong style={{ fontSize: "1.125rem" }}>
                {formatCurrency(summary.totalExpense)}
              </Text>
            </div>
            <div className="flex-1 py-2 transition-transform duration-200 ease-in-out hover:scale-[1.03] cursor-pointer">
              <Title level={5}>Balance</Title>
              <Text
                type={summary.balance >= 0 ? "success" : "danger"}
                strong
                style={{ fontSize: "1.125rem" }}
              >
                {formatCurrency(summary.balance)}
              </Text>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default SummaryStrip;
