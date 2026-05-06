export const DroppiiLogo = ({ color = "#F26B1F", height = 28 }) => (
  <span
    style={{
      fontFamily: '"Be Vietnam Pro", sans-serif',
      fontWeight: 800,
      fontSize: height,
      lineHeight: 1,
      color,
      letterSpacing: "-0.04em",
      display: "inline-flex",
      alignItems: "center",
    }}
  >
    droppi
    <span style={{ position: "relative", display: "inline-block", marginLeft: 1 }}>
      i
      <svg
        width={height * 0.42}
        height={height * 0.42}
        viewBox="0 0 24 24"
        style={{
          position: "absolute",
          top: -height * 0.18,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <path
          d="M4 4 H20 A2 2 0 0 1 22 6 V14 A2 2 0 0 1 20 16 H14 L10 21 V16 H4 A2 2 0 0 1 2 14 V6 A2 2 0 0 1 4 4 Z"
          fill={color}
        />
      </svg>
    </span>
  </span>
);

export const IconChat = ({ size = 24, color = "#F26B1F" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M4 4 H20 A2 2 0 0 1 22 6 V14 A2 2 0 0 1 20 16 H14 L10 21 V16 H4 A2 2 0 0 1 2 14 V6 A2 2 0 0 1 4 4 Z"
      fill={color}
    />
  </svg>
);

export const IconDot = ({ size = 12, color = "#F26B1F" }) => (
  <span
    style={{
      display: "inline-block",
      width: size,
      height: size,
      borderRadius: "50%",
      background: color,
    }}
  />
);

export const IconI = ({ height = 28, color = "#F26B1F" }) => (
  <svg width={height * 0.45} height={height} viewBox="0 0 12 28" fill={color}>
    <circle cx="6" cy="3" r="3" />
    <rect x="2.5" y="9" width="7" height="19" rx="3.5" />
  </svg>
);

export const IconIBody = ({ height = 24, color = "#F26B1F" }) => (
  <svg width={height * 0.32} height={height} viewBox="0 0 8 24" fill={color}>
    <rect x="0" y="0" width="8" height="24" rx="4" />
  </svg>
);

export const BrandPattern = ({ height = 24, colors = ["#F26B1F", "#1E73BE"], count = 8, seed = 1 }) => {
  const rng = (i) => {
    const x = Math.sin(i * 9301 + seed * 49297) * 233280;
    return x - Math.floor(x);
  };
  const shapes = [];
  let chatPlaced = false;
  for (let i = 0; i < count; i++) {
    const r = rng(i);
    const c = colors[i % colors.length];
    let kind;
    if (!chatPlaced && (i === Math.floor(count / 2) || i === count - 1)) {
      kind = "chat";
      chatPlaced = true;
    } else if (r < 0.4) kind = "dot";
    else if (r < 0.75) kind = "ibody";
    else kind = "i";
    shapes.push({ kind, color: c, key: i });
  }
  if (!chatPlaced) shapes[0].kind = "chat";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: height * 0.5, height }}>
      {shapes.map((s) => {
        if (s.kind === "chat") return <IconChat key={s.key} size={height * 0.95} color={s.color} />;
        if (s.kind === "dot") return <IconDot key={s.key} size={height * 0.45} color={s.color} />;
        if (s.kind === "ibody") return <IconIBody key={s.key} height={height * 0.85} color={s.color} />;
        return <IconI key={s.key} height={height * 0.95} color={s.color} />;
      })}
    </div>
  );
};
