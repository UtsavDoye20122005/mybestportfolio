"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useGithubContributions } from "./useGithubContributions";

// GitHub's own 0–4 levels, scaled against your busiest days, so light days still show.
const LEVEL_OPACITY = [0, 0.3, 0.5, 0.75, 1];

function cellStyle(level: number, count: number) {
  const l = count > 0 ? Math.max(1, Math.min(4, level)) : 0;
  if (l === 0) return { background: "var(--rule)" };
  return { background: "var(--accent)", opacity: LEVEL_OPACITY[l] };
}

export function GithubHeatmap({ username }: { username: string }) {
  const { data, error } = useGithubContributions(username);
  const [hover, setHover] = useState<{ x: number; y: number; text: string } | null>(null);

  const grid = useMemo(() => {
    // 52x7 expected; API returns weeks array.
    const weeks = data?.contributions ?? [];
    const sliced = weeks.slice(Math.max(0, weeks.length - 52));
    return sliced.map((w) => w.contributionDays.slice(0, 7));
  }, [data]);

  const totalLast12Months = data?.totalLast12Months;
  const totalAllTime = data?.totalAllTime;

  const isEmpty = data && (data.contributions?.length ?? 0) === 0;
  if (error || isEmpty) return null;

  return (
    <section aria-label="GitHub contributions" className="mt-10" data-reveal>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--fg)]">
            CONTRIBUTIONS · LAST 12 MONTHS
          </h2>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
            Activity from @{username}
          </p>
        </div>

        <Link
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex font-mono text-xs uppercase tracking-[0.24em] text-[var(--fg)]"
        >
          Open GitHub <span className="text-[var(--accent)]">→</span>
        </Link>
      </div>

      <div className="mt-4 relative">
        {!data ? (
          <div className="heatmap-scroll" aria-hidden="true">
            <div className="heatmap">
              {Array.from({ length: 52 * 7 }).map((_, i) => (
                <span key={i} className="heatmap__cell heatmap__cell--skeleton" />
              ))}
            </div>
          </div>
        ) : (
          <div className="heatmap-scroll">
            <div className="heatmap" role="grid" aria-label="Contribution heatmap">
              {grid.map((week, wi) => (
                <div key={wi} className="heatmap__col" role="row">
                  {week.map((d, di) => {
                    const c = d?.count ?? 0;
                    const date = d?.date ?? "";
                    const style = cellStyle(d?.level ?? 0, c);
                    return (
                      <button
                        key={di}
                        type="button"
                        className="heatmap__cell"
                        style={style}
                        onMouseEnter={(e) => {
                          const r = (e.target as HTMLElement).getBoundingClientRect();
                          setHover({
                            x: r.left + r.width / 2,
                            y: r.top,
                            text: `${c} contributions on ${date}`,
                          });
                        }}
                        onMouseLeave={() => setHover(null)}
                        aria-label={`${c} contributions on ${date}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {hover ? (
          <div
            className="heatmap__tooltip"
            style={{
              left: hover.x,
              top: hover.y,
              transform: "translate(-50%, -120%)",
            }}
            role="status"
          >
            {hover.text}
          </div>
        ) : null}
      </div>

      {typeof totalLast12Months === "number" ? (
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
          <span className="text-[var(--fg)]">{totalLast12Months}</span> in the last 12 months
          {typeof totalAllTime === "number" && totalAllTime > totalLast12Months ? (
            <>
              {" · "}
              <span className="text-[var(--fg)]">{totalAllTime}</span> all time
            </>
          ) : null}
        </p>
      ) : null}
    </section>
  );
}
