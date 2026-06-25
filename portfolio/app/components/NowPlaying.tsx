"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Track = { isPlaying: boolean; name: string; artist: string };

function truncate(s: string, n: number) {
  if (s.length <= n) return s;
  return s.slice(0, Math.max(0, n - 1)).trimEnd() + "…";
}

export function NowPlaying() {
  const [track, setTrack] = useState<Track | null>(null);
  const [fade, setFade] = useState(false);
  const lastKey = useRef<string>("");

  const label = track?.isPlaying ? "NOW PLAYING" : "LAST PLAYED";
  const text = track?.name
    ? `${truncate(track.name, 30)} — ${track.artist ?? ""}`.trim()
    : "";

  const key = useMemo(() => `${label}:${text}`, [label, text]);

  useEffect(() => {
    let cancelled = false;

    const pull = async () => {
      try {
        const res = await fetch("/api/spotify/now-playing", { cache: "no-store" });
        const json = (await res.json()) as Track;
        if (cancelled) return;

        const nextLabel = json.isPlaying ? "NOW PLAYING" : "LAST PLAYED";
        const nextText = json.name ? `${truncate(json.name, 30)} — ${json.artist ?? ""}`.trim() : "";
        const nextKey = `${nextLabel}:${nextText}`;

        if (lastKey.current && lastKey.current !== nextKey) {
          setFade(true);
          window.setTimeout(() => {
            if (cancelled) return;
            setTrack(json);
            setFade(false);
            lastKey.current = nextKey;
          }, 180);
        } else {
          setTrack(json);
          lastKey.current = nextKey;
        }
      } catch {
        // ignore
      }
    };

    pull();
    const id = window.setInterval(pull, 30_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  if (!track?.name) return null;

  return (
    <div className={["now-playing", fade ? "now-playing--fade" : ""].join(" ")}>
      <span className="now-playing__note" aria-hidden="true">
        ♪
      </span>
      <span className="now-playing__label">{label}</span>
      <span className="now-playing__sep">·</span>
      <span className="now-playing__text">{text}</span>
    </div>
  );
}

