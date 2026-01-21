"use client";

import dynamic from "next/dynamic";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export default function PlainChart() {
  const data = [
    {
      type: "pie",
      values: [
        120, 90, 75, 60, 150,
        110, 95, 80, 70, 65,
        140, 100, 85, 55, 55,
        130, 105, 98, 88, 50
      ],
      labels: [
        "Chrome","Firefox","Edge","Safari","Brave","Opera",
        "Vivaldi","Samsung Internet","UC Browser","Tor",
        "Internet Explorer","DuckDuckGo","Yandex","Maxthon",
        "Pale Moon","QQ Browser","Sogou","Baidu","Whale","Other"
      ],  hoverinfo: "label+value",
      textinfo: "none", 
    },
  ];

  const layout = {
    title: {
      text: "Compact Chart",
      font: { size: 12 }, 
    },
    showlegend: false,
    autosize: true,        
    margin: { t: 30, l: 0, r: 0, b: 30 }, 
    width: 180,              
    height: 300,            
    paper_bgcolor: "transparent",
  };

  return (
    <Plot
      data={data}
      layout={layout}
      config={{
        displayModeBar: false, 
      }}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
