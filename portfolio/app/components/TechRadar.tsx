"use client";

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const data = {
  labels: [
    "Frontend Dev",
    "Backend Dev",
    "AI & Automation",
    "Finance & Trading",
    "DevOps",
    "UI/UX Design"
  ],
  datasets: [
    {
      label: "Skill Level",
      data: [85, 80, 75, 70, 60, 65],
      backgroundColor: "rgba(232, 255, 0, 0.15)", // #e8ff00 with 15% opacity
      borderColor: "#e8ff00",
      borderWidth: 2,
      pointBackgroundColor: "#e8ff00",
      pointBorderColor: "#e8ff00",
      pointHoverBackgroundColor: "#e8ff00",
      pointHoverBorderColor: "#e8ff00",
      pointRadius: 4,
      pointHoverRadius: 6,
    },
  ],
};

const options = {
  scales: {
    r: {
      angleLines: { color: "#2a2a2a" },
      grid: { color: "#2a2a2a" },
      pointLabels: {
        color: "#666666",
        font: { family: "'JetBrains Mono', monospace", size: 10 },
      },
      ticks: { display: false, min: 0, max: 100, stepSize: 20 },
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "rgba(10, 10, 10, 0.9)",
      titleFont: { family: "'JetBrains Mono', monospace", size: 11 },
      bodyFont: { family: "'JetBrains Mono', monospace", size: 11 },
      bodyColor: "#e8ff00",
      titleColor: "#f0ede6",
      borderColor: "rgba(232, 255, 0, 0.3)",
      borderWidth: 1,
      displayColors: false,
      callbacks: {
        label: function(context: any) {
          return `${context.raw}%`;
        }
      }
    },
  },
  animation: {
    duration: 1500,
    easing: "easeOutQuart" as const,
  },
  maintainAspectRatio: false,
};

export function TechRadar() {
  return (
    <section aria-label="Capabilities" className="mt-16" data-reveal>
      <h2 className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--fg)]">
        Capabilities
      </h2>
      <div className="mt-8 flex flex-col md:flex-row gap-10 items-center justify-between border border-[var(--rule)] p-6 md:p-10">
        <div className="w-full md:w-[50%] h-[300px] md:h-[400px] pb-4">
          <Radar data={data} options={options} />
        </div>
        <div className="w-full md:w-[45%] space-y-4">
          {data.labels.map((label, i) => (
            <div key={label} className="group">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--accent)]"></span>
                  <span className="font-mono text-xs text-[var(--fg)]">{label}</span>
                </div>
                <span className="font-mono text-[10px] text-[var(--muted)]">{data.datasets[0].data[i]}%</span>
              </div>
              <div className="h-1 w-full bg-[#1a1a1a] rounded overflow-hidden">
                <div 
                  className="h-full bg-[var(--accent)] transition-all duration-1000 ease-out"
                  style={{ width: `${data.datasets[0].data[i]}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
