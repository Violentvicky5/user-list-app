"use client";

import dynamic from "next/dynamic";

const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
});

export default function UserSummaryPie({ summary }) {
  const data = [
    {
      type: "pie",
      labels: ["Work 1", "Work 2", "Work 3", "Unassigned"],
      values: [
        summary.workCounts.work1,
        summary.workCounts.work2,
        summary.workCounts.work3,
        summary.unAssignedUsers,
      ],
      textinfo: "label+percent",
      hoverinfo: "label+value",
      hole: 0.3,
    },
  ];

 const layout = {
  title: {
    text: "User Work Distribution",
    xanchor: "right",
    font: { size: 18 },
  },
  legend: {
    orientation: "h",
    x: 1,
    y: 0.5,
  },
  margin: { t: 80, l: 0, r: 0, b: 0 },
};

  return (
    <Plot
      data={data}
      layout={layout}
      style={{ width: "100%", height: "400px" }}
      config={{ displayModeBar: false }}
    />
  );
}
