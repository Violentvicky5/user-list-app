"use client";

import dynamic from "next/dynamic";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export default function UserSummaryPie() {
  const data = [
    {
      type: "pie",

      values: [
        120, 90, 79, 60, 150, 110, 95, 80, 70, 65, 140, 100, 85, 55, 55, 130,
        105, 98, 88, 50,
      ],
      labels: [
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
      ],
      
      textinfo: "label",
      textposition: "outside",
       textfont: { size: 11, color: "black" },
      hoverinfo: "label+value+percent",
        domain: { x: [0.05, 0.75], y: [0.35, 0.75] }, // shrink pie to center
    },
  ];

 const layout = {
  title: {
    text: "Type 7",
    font: { size: 18 },
  },
  showlegend: false,
  margin: { t: 30, l: 25, r: 10, b: 10 },
  autosize: false,          
  width: 280,         
  height: 250,        
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
