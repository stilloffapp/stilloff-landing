import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "StillOff — When you can't stop, StillOff does.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#13110E",
          position: "relative",
        }}
      >
        {/* ambient glow */}
        <div
          style={{
            position: "absolute",
            width: 700,
            height: 700,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(110,70,55,0.38) 0%, rgba(196,149,106,0.12) 45%, transparent 72%)",
            filter: "blur(60px)",
          }}
        />

        {/* orb */}
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(225,175,120,0.78) 0%, rgba(130,82,62,0.72) 45%, rgba(50,28,18,0.28) 75%, transparent 100%)",
            marginBottom: 48,
            flexShrink: 0,
          }}
        />

        <div
          style={{
            fontSize: 16,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#A09480",
            marginBottom: 28,
          }}
        >
          Real-time intervention
        </div>

        <div
          style={{
            fontSize: 72,
            fontWeight: 300,
            color: "#F4EFE8",
            lineHeight: 1.06,
            textAlign: "center",
            maxWidth: 900,
          }}
        >
          When you can&apos;t stop,{" "}
          <span style={{ color: "#C4956A" }}>StillOff</span> does.
        </div>

        <div
          style={{
            fontSize: 22,
            color: "#A09480",
            marginTop: 32,
            textAlign: "center",
            maxWidth: 600,
          }}
        >
          A 60-second lock that interrupts the spiral.
        </div>
      </div>
    ),
    { ...size }
  );
}
