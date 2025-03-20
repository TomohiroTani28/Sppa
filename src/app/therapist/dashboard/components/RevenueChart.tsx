"use client";
// src/app/therapist/dashboard/components/RevenueChart.tsx
import { LineChart } from "@mantine/charts";
import { useTransactions } from "@/app/hooks/api/useTransactions";
import { Transaction } from "@/types/transaction"; // Transaction型をインポート

interface RevenueChartProps {
  therapistId: string;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ therapistId }) => {
  const { transactions, loading } = useTransactions(therapistId, "month");

  if (loading) return <div>Loading revenue data...</div>;

  const chartData =
    transactions?.map((t: Transaction) => ({
      date: new Date(t.created_at).toLocaleDateString(),
      revenue: t.amount,
    })) || [];

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2 text-gray-700">
        Revenue This Month
      </h3>
      <LineChart
        h={300}
        data={chartData}
        dataKey="date"
        series={[{ name: "revenue", color: "blue" }]}
        curveType="natural"
      />
    </div>
  );
};

export default RevenueChart;