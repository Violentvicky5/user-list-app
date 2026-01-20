"use client";

import dynamic from "next/dynamic";

const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
});

export default function UserSummaryPieChart({ summary }) {
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
    },
  ];

  const layout = {
    title: {
      text: "User Work Distribution",
      font: { size: 18 },
    },
    legend: {
      orientation: "v",
      x: 1.2,
      xanchor: "center",
      yanchor:"top",
      y:1,
    },
 margin: { t: 80, l: 0, r: 0, b: 25 },
 height:400,
  width:400,
  autosize:false,
  };

  return (
    <Plot
      data={data}
      layout={layout}
      config={{ displayModeBar: false }}
    />
  );
}
