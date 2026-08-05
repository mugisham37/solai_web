import { ImageResponse } from "next/og";
import { siteMeta } from "@/data/site-meta";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "#024241",
          padding: 80,
        }}
      >
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: 24,
            background: "#FF7F5C",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="#2A0A02">
            <path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12z" />
          </svg>
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "#F2EDE7",
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
            lineHeight: 0.95,
          }}
        >
          SolAI
        </div>
        <div style={{ fontSize: 32, color: "#FF7F5C", marginTop: 16 }}>
          {siteMeta.organizationName}
        </div>
      </div>
    ),
    { ...size },
  );
}
