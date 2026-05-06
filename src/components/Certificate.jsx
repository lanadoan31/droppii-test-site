import { DroppiiLogo, IconChat, BrandPattern } from "./Brand";
import { QUESTIONS } from "../data/questions";

export default function Certificate({ tweaks, seller, answers, onBack }) {
  const primary = tweaks.primaryColor;
  const secondary = tweaks.secondaryColor;

  const correctCount = QUESTIONS.filter((q) => {
    const a = answers[q.id];
    if (q.type === "short") return typeof a === "string" && a.trim().length >= 30;
    const arr = Array.isArray(a) ? [...a].sort() : [];
    return JSON.stringify(arr) === JSON.stringify([...q.correct].sort());
  }).length;
  const scorePct = Math.round((correctCount / QUESTIONS.length) * 100);
  const certNo = "DRP-AI-2026-" + (10000 + correctCount * 137).toString();
  const dateStr = new Date().toLocaleDateString("vi-VN", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <div className="screen cert-screen" style={{ background: "#F4F1EB" }}>
      <header className="topbar">
        <button className="btn-ghost" onClick={onBack}>← Quay lại</button>
        <div style={{ flex: 1 }} />
        <button className="btn-ghost" onClick={() => window.print()}>In / Lưu PDF</button>
      </header>

      <main className="cert-main">
        <div className="certificate" id="cert-print">
          <div className="cert-border" style={{ borderColor: primary }}>
            <div className="cert-corner cert-corner-tl">
              <BrandPattern height={18} count={6} colors={[primary, secondary]} seed={5} />
            </div>
            <div className="cert-corner cert-corner-br" style={{ transform: "rotate(180deg)" }}>
              <BrandPattern height={18} count={6} colors={[secondary, primary]} seed={9} />
            </div>

            <div className="cert-logo">
              <DroppiiLogo color={primary} height={36} />
            </div>

            <div className="cert-eyebrow">CHỨNG CHỈ ĐIỆN TỬ · ELECTRONIC CERTIFICATE</div>
            <h1 className="cert-title">
              AI Seller<span className="cert-title-sep">·</span>Level 1
            </h1>
            <div className="cert-sub">Sử dụng AI trong tư vấn sản phẩm chăm sóc sức khoẻ</div>

            <div className="cert-divider">
              <span style={{ background: primary }} />
              <IconChat size={16} color={primary} />
              <span style={{ background: secondary }} />
            </div>

            <div className="cert-awarded">Chứng chỉ này được trao cho</div>
            <div className="cert-name">{seller.name}</div>
            <div className="cert-id">Mã nhà bán hàng · {seller.id}</div>

            <p className="cert-body">
              đã hoàn thành Bài kiểm tra Kiến thức AI cho Nhà bán hàng Droppii với điểm số{" "}
              <strong>{scorePct}%</strong>, đáp ứng đầy đủ tiêu chuẩn về sử dụng AI có trách nhiệm trong tư vấn
              sản phẩm chăm sóc sức khoẻ và vitamin.
            </p>

            <div className="cert-foot">
              <div className="cert-foot-col">
                <div className="cert-sig" style={{ borderTopColor: primary }} />
                <div className="cert-sig-name">Trần Quốc Anh</div>
                <div className="cert-sig-role">Giám đốc Đào tạo · Droppii</div>
              </div>
              <div className="cert-foot-mid">
                <div className="cert-seal" style={{ borderColor: primary, color: primary }}>
                  <div className="cert-seal-inner">
                    <IconChat size={20} color={primary} />
                    <div className="cert-seal-txt">DROPPII</div>
                    <div className="cert-seal-sub">CERTIFIED</div>
                  </div>
                </div>
              </div>
              <div className="cert-foot-col">
                <div className="cert-sig" style={{ borderTopColor: secondary }} />
                <div className="cert-sig-name">{dateStr}</div>
                <div className="cert-sig-role">Ngày cấp · Hiệu lực 12 tháng</div>
              </div>
            </div>

            <div className="cert-no">No. {certNo}</div>
          </div>
        </div>

        <div className="cert-actions">
          <button
            className="btn-primary"
            style={{ background: primary, boxShadow: `0 8px 22px -10px ${primary}` }}
            onClick={() => window.print()}
          >
            Tải chứng chỉ (PDF)
          </button>
          <button className="btn-ghost-strong" onClick={onBack}>Xem lại kết quả</button>
        </div>
      </main>
    </div>
  );
}
