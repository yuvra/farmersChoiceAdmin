"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/config";
import { collectionGroup, getDocs } from "firebase/firestore";
import ReactECharts from "echarts-for-react";

const AnalyticsPage = () => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchOrders = async () => {
      const querySnapshot = await getDocs(collectionGroup(db, "userProfilesAndOrderStatus"));
      let allOrders: any[] = [];

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data?.orders) {
          allOrders.push(...data.orders);
        }
      });

      const aggregated = aggregateOrderData(allOrders);
      const statusData = aggregateStatusData(allOrders);

      setChartData(aggregated);
      setStatusCounts(statusData);
    };

    fetchOrders();
  }, []);

  const aggregateOrderData = (orders: any[]) => {
    const dailyData: Record<string, { orders: number; sales: number }> = {};

    orders.forEach((order) => {
      const createdAt = order?.createdAt;
      const date = createdAt?.toDate?.()?.toISOString?.()?.split("T")[0] ||
        new Date(createdAt).toISOString().split("T")[0];

      if (!dailyData[date]) {
        dailyData[date] = { orders: 0, sales: 0 };
      }

      dailyData[date].orders += 1;

      order.items?.forEach((item: any) => {
        const variant = item?.variant;
        const quantity = Number(item?.quantity ?? 1);

        if (variant && typeof variant.price === "number") {
          dailyData[date].sales += variant.price * quantity;
        }
      });
    });

    const sortedDates = Object.keys(dailyData).sort();
    return sortedDates.map((date) => ({
      date,
      ...dailyData[date],
    }));
  };

  const aggregateStatusData = (orders: any[]) => {
    const statusData: Record<string, number> = {};
    orders.forEach((order) => {
      const status = order?.status || "Unknown";
      statusData[status] = (statusData[status] || 0) + 1;
    });
    return statusData;
  };

  const ordersOption = {
    title: { text: "Orders per Day", left: "center", top: 10, textStyle: { color: "#fff" } },
    tooltip: {},
    xAxis: { type: "category", data: chartData.map((d) => d.date) },
    yAxis: { type: "value" },
    series: [
      {
        name: "Orders",
        type: "bar",
        data: chartData.map((d) => d.orders),
        color: "#6495ED",
      },
    ],
  };

  const salesOption = {
    title: { text: "Total Sales per Day", left: "center", top: 10, textStyle: { color: "#fff" } },
    tooltip: { trigger: "axis" },
    legend: { data: ["Sales"], bottom: 0, textStyle: { color: "#fff" } },
    xAxis: { type: "category", data: chartData.map((d) => d.date) },
    yAxis: { type: "value" },
    series: [
      {
        name: "Sales",
        type: "bar",
        data: chartData.map((d) => d.sales),
        color: "#00BFFF",
      },
    ],
  };

  const statusOption = {
    title: { text: "Order Status Distribution", left: "center", top: 10, textStyle: { color: "#fff" } },
    tooltip: { trigger: "item" },
    legend: { bottom: 0, textStyle: { color: "#fff" } },
    series: [
      {
        name: "Orders",
        type: "pie",
        radius: "55%",
        center: ["50%", "50%"],
        data: Object.entries(statusCounts).map(([status, count]) => ({
          name: status,
          value: count,
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        label: { color: "#fff" },
        labelLine: { lineStyle: { color: "#fff" } },
        color: ["#4169E1", "#32CD32", "#FFD700", "#FF6347", "#00CED1"],
      },
    ],
  };

  return (
    <div style={{ backgroundColor: "#121212", color: "#fff", padding: "2rem", minHeight: "100vh" }}>
      <h2 style={{ fontSize: "28px", marginBottom: "2rem" }}>📊 Order & Sales Analytics</h2>

      <div style={{ background: "#1e1e1e", borderRadius: "10px", padding: "1.5rem", marginBottom: "2rem" }}>
        <ReactECharts option={ordersOption} style={{ height: 300 }} />
      </div>

      <div style={{ background: "#1e1e1e", borderRadius: "10px", padding: "1.5rem", marginBottom: "2rem" }}>
        <ReactECharts option={salesOption} style={{ height: 300 }} />
      </div>

      <div style={{ background: "#1e1e1e", borderRadius: "10px", padding: "1.5rem" }}>
        <ReactECharts option={statusOption} style={{ height: 400 }} />
      </div>
    </div>
  );
};

export default AnalyticsPage;
