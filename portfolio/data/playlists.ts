export type Playlist = {
  number: number;
  name: string;
  genre: string;
  spotifyUrl: string;
  embedId: string; // Spotify playlist ID for embed
};

// Playlists removed — music section disabled.
export const playlists: Playlist[] = [];

export const mainRepeatEmbedId = "";

