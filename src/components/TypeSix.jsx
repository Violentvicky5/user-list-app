"use client";

import dynamic from "next/dynamic";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export default function UserSummaryPieChart() {
  const data = [
    {
      type: "pie",
      values: [
        120, 90, 85, 60, 150,
        110, 95, 80, 70, 65,
        140, 100, 85, 55, 55,
        130, 105, 98, 88, 50
      ],
      labels: [
        "Chrome","Firefox","Edge","Safari","Brave","Opera",
        "Vivaldi","Samsung Internet","UC Browser","Tor",
        "Internet Explorer","DuckDuckGo","Yandex","Maxthon",
        "Pale Moon","QQ Browser","Sogou","Baidu","Whale","Other"
      ],
      textinfo: "label",
      textposition: "inside",
      hoverinfo: "label+value+percent",
      textfont: { size: 8, color: "black" },
      textorientation: "radial",
      pull:0.035,
    },
  ];

 const layout = {
  title: {
    text: "Type 6",
    font: { size: 18 },
  },
  showlegend: false,
  margin: { t: 30, l: 0, r: 0, b: 0 },
  autosize: true,           
  width: undefined,         
  height: undefined,      
 // paper_bgcolor: "lightgray",
};


  return (
    <Plot
      data={data}
      layout={layout}
      config={{
        displayModeBar: true,
        displaylogo: false,
       
      }}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
