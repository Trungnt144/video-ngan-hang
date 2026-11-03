import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const MyComponent: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 12 } });
  const subtitleOpacity = interpolate(frame, [30, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const progress = interpolate(frame, [0, durationInFrames - 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(160deg, #0f172a 0%, #1e3a8a 100%)",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Segoe UI, Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          color: "white",
          fontSize: 110,
          fontWeight: 800,
          textAlign: "center",
        }}
      >
        Video Factory
      </div>
      <div
        style={{
          opacity: subtitleOpacity,
          color: "#93c5fd",
          fontSize: 48,
          marginTop: 40,
          textAlign: "center",
        }}
      >
        Remotion đã sẵn sàng ✅
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 90,
          right: 90,
          height: 14,
          borderRadius: 7,
          background: "rgba(255,255,255,0.2)",
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: "100%",
            borderRadius: 7,
            background: "#60a5fa",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
