import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {TypographyH1, TypographyH2, TypographyH3, TypographyMuted} from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { formatCurrency } from "../utils/formatCurrency";
import { getSummary } from "../api/reportApi";
import ErrorPlaceholder from "./ErrorPlaceholder";
import { Loader2 } from "lucide-react";
import {Loader} from "@/components/ui/loader.jsx";

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
    <div className="mx-auto mt-4">
      <Card className="mb-4">
        <CardContent className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-border p-0">
          {loading ? (
            <Loader message="Calculating..."/>
          ) : error ? (
            <ErrorPlaceholder
              message="Summary data is currently unavailable."
              subMessage="Please try again later."
            />
          ) : (
            <>
              <div className="flex-1 p-6 text-center transition-transform duration-200 ease-in-out hover:scale-[1.03]">
                <TypographyMuted className="mb-1">Total Income</TypographyMuted>
                <TypographyH1 className="text-green-600">{formatCurrency(summary.totalIncome)}</TypographyH1>
              </div>
              <div className="flex-1 p-6 text-center transition-transform duration-200 ease-in-out hover:scale-[1.03]">
                <TypographyMuted className="mb-1">Total Expense</TypographyMuted>
                <TypographyH1 className="text-red-600">{formatCurrency(summary.totalExpense)}</TypographyH1>
              </div>
              <div className="flex-1 p-6 text-center transition-transform duration-200 ease-in-out hover:scale-[1.03]">
                <TypographyMuted className="mb-1">Balance</TypographyMuted>
                <TypographyH1 className={cn(summary.balance >= 0 ? "text-green-600" : "text-red-600")}>{formatCurrency(summary.balance)}</TypographyH1>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryStrip;
