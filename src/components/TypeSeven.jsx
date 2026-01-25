"use client";

import dynamic from "next/dynamic";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export default function TypeNine() {
  const values = [
    120, 90, 79, 60, 150, 110, 95, 80, 70, 65,
    140, 100, 85, 55, 55, 130, 105, 98, 88, 50
  ];

  const labels = [
    "Chrome","Firefox","Edge","Safari","Brave","Opera",
    "Vivaldi","Samsung Internet","UC Browser","Tor",
    "Internet Explorer","DuckDuckGo","Yandex","Maxthon",
    "Pale Moon","QQ Browser","Sogou","Baidu","Whale","Other"
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
      domain: { x: [0, 0.497], y: [0.1, 1] } // leave right side for legend
    }
  ];

  const layout = {
    title: { text: "type 8", font: { size: 18 } },
    margin: { t: 30, l: 10, r: 10, b: 10 },
    autosize: false,
    width: 290,
    height: 250,
    legend: {
      font: { size: 7 },
      itemclick: "toggle",
      itemdoubleclick: "toggleothers",
      orientation: "v",
      x: 0.540,
      xanchor: "left",
      y: 0.3,        // reduce visible scroll height (less than 1)
      yanchor: "bottom",
      itemsizing: "constant",
      traceorder: "normal"
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


