"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import type { ChartData, ChartOptions, TooltipItem } from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const labels = [
  "Frontend Dev",
  "Backend Dev",
  "AI & Automation",
  "Finance & Trading",
  "DevOps",
  "UI/UX Design",
];

const scores = [85, 80, 75, 70, 60, 65];

function getThemeColors() {
  if (typeof window === "undefined") {
    return {
      accent: "#e8ff00",
      fg: "#f0ede6",
      muted: "rgba(240, 237, 230, 0.72)",
      rule: "rgba(240, 237, 230, 0.14)",
      cardBg: "#111111",
      subtleBg: "rgba(255, 255, 255, 0.01)",
    };
  }

  const styles = getComputedStyle(document.documentElement);
  return {
    accent: styles.getPropertyValue("--accent").trim(),
    fg: styles.getPropertyValue("--fg").trim(),
    muted: styles.getPropertyValue("--muted").trim(),
    rule: styles.getPropertyValue("--rule").trim(),
    cardBg: styles.getPropertyValue("--card-bg").trim(),
    subtleBg: styles.getPropertyValue("--subtle-bg").trim(),
  };
}

export function TechRadar() {
  const [colors, setColors] = useState(getThemeColors);

  useEffect(() => {
    const updateColors = () => setColors(getThemeColors());
    updateColors();

    const observer = new MutationObserver(updateColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    window.addEventListener("storage", updateColors);

    return () => {
      observer.disconnect();
      window.removeEventListener("storage", updateColors);
    };
  }, []);

  const data = useMemo<ChartData<"radar">>(
    () => ({
      labels,
      datasets: [
        {
          label: "Skill Level",
          data: scores,
          backgroundColor: colors.subtleBg,
          borderColor: colors.accent,
          borderWidth: 2,
          pointBackgroundColor: colors.accent,
          pointBorderColor: colors.accent,
          pointHoverBackgroundColor: colors.accent,
          pointHoverBorderColor: colors.accent,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    }),
    [colors]
  );

  const options = useMemo<ChartOptions<"radar">>(
    () => ({
      scales: {
        r: {
          angleLines: { color: colors.rule },
          grid: { color: colors.rule },
          pointLabels: {
            color: colors.muted,
            font: { family: "'JetBrains Mono', monospace", size: 10 },
          },
          ticks: { display: false, min: 0, max: 100, stepSize: 20 },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: colors.cardBg,
          titleFont: { family: "'JetBrains Mono', monospace", size: 11 },
          bodyFont: { family: "'JetBrains Mono', monospace", size: 11 },
          bodyColor: colors.accent,
          titleColor: colors.fg,
          borderColor: colors.rule,
          borderWidth: 1,
          displayColors: false,
          callbacks: {
            label(context: TooltipItem<"radar">) {
              return `${context.raw}%`;
            },
          },
        },
      },
      animation: {
        duration: 1500,
        easing: "easeOutQuart" as const,
      },
      maintainAspectRatio: false,
    }),
    [colors]
  );

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
          {labels.map((label, i) => (
            <div key={label} className="group">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--accent)]"></span>
                  <span className="font-mono text-xs text-[var(--fg)]">{label}</span>
                </div>
                <span className="font-mono text-[10px] text-[var(--muted)]">{scores[i]}%</span>
              </div>
              <div className="h-1 w-full bg-[var(--card-border)] rounded overflow-hidden">
                <div
                  className="h-full bg-[var(--accent)] transition-all duration-1000 ease-out"
                  style={{ width: `${scores[i]}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
