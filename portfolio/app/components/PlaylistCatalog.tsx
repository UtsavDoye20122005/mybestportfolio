"use client";

import Link from "next/link";
import { playlists } from "../../data/playlists";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export function PlaylistCatalog({
  condensed = false,
}: {
  condensed?: boolean;
}) {
  const rows = condensed ? playlists.slice(0, 2) : playlists;

  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 md:px-6">
      <div className="border-x border-[var(--rule)] px-4 pb-10 md:px-10" data-reveal>
        <div className="pt-2">
          <div className="flex items-end justify-between gap-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--muted)]">
              WHAT I'M LISTENING TO
            </p>
            {condensed ? (
              <Link
                href="/music"
                className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--fg)]"
              >
                VIEW ALL <span className="text-[var(--accent)]">→</span>
              </Link>
            ) : null}
          </div>

          <div className="mt-4 changelog__rule" aria-hidden="true">
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          </div>
        </div>

        <div className="playlist">
          {rows.map((p) => (
            <a
              key={p.number}
              href={p.spotifyUrl}
              target="_blank"
              rel="noreferrer"
              className="playlist__row"
            >
              <span className="playlist__num">#{pad2(p.number)}</span>
              <span className="playlist__name">{p.name}</span>
              <span className="playlist__genre">· {p.genre}</span>
              <span className="playlist__arrow" aria-hidden="true">
                ↗
              </span>
            </a>
          ))}
        </div>

        <div className="changelog__rule" aria-hidden="true">
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        </div>
      </div>
    </section>
  );
}

