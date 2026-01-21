"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export default function TypeFour({ labels = [], values = [] }) {
  // Prepare data -useMemo to avoid recalculations
  const data = useMemo(
    () =>
      labels.map((label, index) => ({
        label,
        value: values[index] ?? 0,
      })),
    [labels, values]
  );

  //to calculate total for percentage calculation
  const total = useMemo(() => data.reduce((sum, d) => sum + d.value, 0), [data]);

  // Add percentage and sort descending
  const enriched = useMemo(() => {
    return data
      .map(d => ({
        ...d,
        percent: total ? (d.value / total) * 100 : 0,
      }))
      .sort((a, b) => b.percent - a.percent);
  }, [data, total]);
  //returns an array of objects with label, value and percent properties

  // vieww visible slices -initially all visible when some labels are toggled off then not visible
  const [visible, setVisible] = useState(() => new Set(enriched.map(d => d.label)));

  const toggle = label => {
    const next = new Set(visible);
    next.has(label) ? next.delete(label) : next.add(label);
    setVisible(next);
  };

  const visibleData = enriched.filter(d => visible.has(d.label));

  
  const colors = useMemo(() => {
    const defaultColors = [
      "#636efa", "#EF553B", "#00cc96", "#ab63fa", "#FFA15A",
      "#19d3f3", "#FF6692", "#B6E880", "#FF97FF", "#FECB52",
      "#636efa", "#EF553B", "#00cc96", "#ab63fa", "#FFA15A",
      "#19d3f3", "#FF6692", "#B6E880", "#FF97FF", "#FECB52",
    ];
    return enriched.map((_, i) => defaultColors[i % defaultColors.length]);
  }, [enriched]);

  return (
    <div className="w-full h-full flex gap-2 items-start relative">
      {/* Pie */}
      <div className="flex-1 h-full">
        <Plot
          data={[
            {
              type: "pie",
              labels: visibleData.map(d => d.label),
              values: visibleData.map(d => d.value),
              text: visibleData.map(d => `${d.percent.toFixed(1)}%`),
               textfont: { size: 9 },
  insidetextorientation: "radial",
              textinfo: "text",
              hovertemplate: "%{label}: %{text}<extra></extra>",
              marker: { colors: colors.filter((_, i) => visible.has(enriched[i].label)) }, //only include colors for visible labels
            pull: 0,
            },
          ]}
          layout={{
            title: { text: "type 3", font: { size: 16 } },
            showlegend: false,
            margin: { t: 35, b: 0, l: 0, r: 0 },
            autosize: true,
          //  paper_bgcolor: "lightgray",
          }}
          config={{
            responsive: true,
            displayModeBar: false, 
            
          }}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* Legend dropdown */}
      <details className="relative shrink-0 self-end">
        <summary className="list-none cursor-pointer p-1 rounded hover:bg-gray-100 flex items-center">
          <AdjustmentsHorizontalIcon className="w-4 h-4 text-gray-600" />
        </summary>

        <div className="absolute right-0 z-20 bg-white shadow-lg rounded-md p-2 max-h-48 overflow-auto min-w-[170px]">
  {enriched.map((item, index) => (
    <label
      key={item.label}
      className="flex items-center gap-2 text-[10px] whitespace-nowrap"
    >
      <input
        type="checkbox"
        checked={visible.has(item.label)}
        onChange={() => toggle(item.label)}
      />
      {/* Color square */}
      <span
        className="w-3 h-3 inline-block rounded-sm"
        style={{ backgroundColor: colors[index] }}
      ></span>
      <span className="truncate max-w-[120px]">
        {item.label} — {item.percent.toFixed(1)}%
      </span>
    </label>
  ))}
</div>

      </details>
    </div>
  );
}
