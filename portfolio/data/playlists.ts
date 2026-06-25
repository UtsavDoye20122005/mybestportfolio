export type Playlist = {
  number: number;
  name: string;
  genre: string;
  spotifyUrl: string;
  embedId: string; // Spotify playlist ID for embed
};

export const playlists: Playlist[] = [
  {
    number: 1,
    name: "Late Night Systems",
    genre: "Electronic / Focus",
    spotifyUrl: "https://open.spotify.com/playlist/PLAYLIST_ID_1",
    embedId: "PLAYLIST_ID_1",
  },
  {
    number: 2,
    name: "Market Hours",
    genre: "Lo-fi / Ambient",
    spotifyUrl: "https://open.spotify.com/playlist/PLAYLIST_ID_2",
    embedId: "PLAYLIST_ID_2",
  },
  {
    number: 3,
    name: "Code + Coffee",
    genre: "Indie / Alt",
    spotifyUrl: "https://open.spotify.com/playlist/PLAYLIST_ID_3",
    embedId: "PLAYLIST_ID_3",
  },
];

export const mainRepeatEmbedId = playlists[0]?.embedId ?? "PLAYLIST_ID_1";

