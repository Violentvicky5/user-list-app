"use client";

import dynamic from "next/dynamic";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export default function TypeSeven() {
  const values = [
    120, 90, 79, 60, 150, 110, 95, 80, 70, 65, 140, 100, 85, 55, 55, 130, 105,
    98, 88, 50,
  ];

  const labels = [
    "Chrome",
    "Firefox",
    "Edge",
    "Safari",
    "Brave",
    "Opera",
    "Vivaldi",
    "Samsung Internet",
    "UC Browser",
    "Tor",
    "Internet Explorer",
    "DuckDuckGo",
    "Yandex",
    "Maxthon",
    "Pale Moon",
    "QQ Browser",
    "Sogou",
    "Baidu",
    "Whale",
    "Other",
  ];

  const data = [
    {
      type: "pie",
      values: values,
      labels: labels,
      textinfo: "percent",
      textposition: "inside",
      hoverinfo: "label+value+percent",
      pull: 0.035,
      
      domain: { x: [2, 2], y: [2, 2] },
    },
  ];

  const layout = {
   // title: { text: "type 9", font: { size: 18 } },
    margin: { t: 0, l: 10, r: 10, b: 0 },
    width:250,
    height: 200,
    legend: {
      orientation: "h",
      x: 0.48,
      xanchor: "center",
      y: -1,
      yanchor: "bottom",
      font: { size: 7 }, 
      itemsizing: "constant",
      itemclick: "toggle",
      itemdoubleclick: "toggleothers",
    },
    paper_bgcolor: "lightgray",
  };

  return (
    <Plot
      data={data}
      layout={layout}
      config={{ displayModeBar: true, displaylogo: false }}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
