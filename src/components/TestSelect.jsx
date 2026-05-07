import { DroppiiLogo } from "./Brand";

export default function TestSelect({ tweaks, seller, tests, onSelect }) {
  const primary   = tweaks.primaryColor;
  const secondary = tweaks.secondaryColor;

  return (
    <div className="screen test-select" style={{ background: tweaks.bgColor }}>
      <header className="topbar">
        <DroppiiLogo color={primary} height={28} />
        <div className="seller-chip">
          <div className="avatar" style={{ background: `linear-gradient(135deg, ${primary}, ${secondary})` }}>
            {seller.name.split(" ").pop()[0]}
          </div>
          <div>
            <div className="seller-name">{seller.name}</div>
            <div className="seller-id">ID {seller.id}</div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 640, margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6, color: "#0E1116" }}>
          Chọn bài kiểm tra
        </h1>
        <p style={{ color: "#6B7280", marginBottom: 28, fontSize: 14.5 }}>
          Chọn bài kiểm tra bạn muốn làm.
        </p>

        {tests.length === 0 ? (
          <div style={{ textAlign: "center", color: "#9CA3AF", padding: "60px 0", fontSize: 15 }}>
            Chưa có bài kiểm tra nào được xuất bản.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {tests.map((test) => (
              <button
                key={test.id}
                onClick={() => onSelect(test)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  padding: "18px 22px",
                  background: "#fff",
                  border: "1.5px solid #E5E7EB",
                  borderRadius: 12,
                  cursor: "pointer",
                  textAlign: "left",
                  width: "100%",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = primary;
                  e.currentTarget.style.boxShadow = `0 4px 16px -8px ${primary}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#E5E7EB";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 15.5, color: "#0E1116", marginBottom: 5 }}>
                    {test.title}
                  </div>
                  {test.description && (
                    <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 7 }}>
                      {test.description}
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 12.5, color: "#9CA3AF" }}>
                      {test.questionCount || (test.questions || []).length} câu hỏi
                    </span>
                    <span style={{ fontSize: 12.5, color: "#9CA3AF" }}>{test.duration} phút</span>
                    <span style={{ fontSize: 12.5, color: "#9CA3AF" }}>
                      Đạt ≥ {test.passingScore}%
                    </span>
                  </div>
                </div>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ flexShrink: 0, color: primary }}
                >
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
