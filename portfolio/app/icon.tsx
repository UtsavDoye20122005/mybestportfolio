import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export const dynamic = "force-static"; // Required for static export

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "64px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          color: "#e8ff00",
          border: "2px solid rgba(232,255,0,0.35)",
          fontSize: 22,
          fontFamily: "monospace",
          letterSpacing: "0.18em",
        }}
      >
        UD
      </div>
    ),
    size
  );
}

