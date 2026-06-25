"use client";

import { PlaylistCatalog } from "../components/PlaylistCatalog";
import { mainRepeatEmbedId } from "../../data/playlists";

export default function MusicPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 md:px-6">
      <header className="border-x border-[var(--rule)] px-4 pt-10 pb-8 md:px-10" data-reveal-stagger>
        <div data-reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--muted)]">
            MUSIC
          </p>
          <h1 className="mt-4 font-sans text-4xl tracking-[-0.02em] sm:text-5xl md:text-6xl">
            Listening log.
          </h1>
        </div>
        <div className="mt-8 border-t border-[var(--rule)] pt-6" />
      </header>

      <div className="border-x border-[var(--rule)] px-4 pb-10 md:px-10" data-reveal>
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--muted)]">
          CURRENTLY ON REPEAT
        </p>
        <div className="spotify-embed mt-4">
          <iframe
            src={`https://open.spotify.com/embed/playlist/${mainRepeatEmbedId}`}
            width="100%"
            height="152"
            frameBorder="0"
            loading="lazy"
            title="Spotify playlist embed"
          />
        </div>
      </div>

      <PlaylistCatalog />
    </section>
  );
}

