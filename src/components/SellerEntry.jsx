import { useState } from "react";
import { DroppiiLogo, IconChat, BrandPattern } from "./Brand";

export default function SellerEntry({ tweaks, onContinue }) {
  const primary = tweaks.primaryColor;
  const secondary = tweaks.secondaryColor;
  const [name, setName] = useState("");
  const [sellerId, setSellerId] = useState("");

  const canContinue = name.trim().length >= 2;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canContinue) return;
    onContinue({
      name: name.trim(),
      id: sellerId.trim() || "DRP-SLR-" + Math.floor(10000 + Math.random() * 89999),
      branch: "Sàn thương mại",
    });
  };

  return (
    <div className="screen" style={{ background: tweaks.bgColor }}>
      <header className="topbar">
        <DroppiiLogo color={primary} height={28} />
      </header>

      <div className="entry-wrap">
        <form className="entry-card" onSubmit={handleSubmit}>
          <div className="entry-pattern">
            <BrandPattern height={24} count={7} colors={[primary, secondary]} seed={2} />
          </div>

          <div className="entry-tag">
            <IconChat size={13} color={primary} />
            <span>Chứng chỉ AI cho Nhà bán hàng · 2026</span>
          </div>

          <h1 className="entry-title">Chào mừng bạn!</h1>
          <p className="entry-sub">Nhập thông tin của bạn để bắt đầu bài kiểm tra AI.</p>

          <div className="entry-fields">
            <div className="field-group">
              <label className="field-label" htmlFor="seller-name">
                Họ và tên <span style={{ color: primary }}>*</span>
              </label>
              <input
                id="seller-name"
                type="text"
                className="field-input"
                placeholder="Ví dụ: Nguyễn Thị Lan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                style={{ borderColor: name.length > 0 ? primary : undefined }}
              />
            </div>
            <div className="field-group">
              <label className="field-label" htmlFor="seller-id">
                Mã nhà bán hàng <span style={{ color: "var(--muted)" }}>(tuỳ chọn)</span>
              </label>
              <input
                id="seller-id"
                type="text"
                className="field-input"
                placeholder="Ví dụ: DRP-SLR-04829"
                value={sellerId}
                onChange={(e) => setSellerId(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary btn-start"
            style={{
              background: canContinue ? primary : "#C9CBD0",
              boxShadow: canContinue ? `0 8px 24px -10px ${primary}` : "none",
              width: "100%",
              justifyContent: "center",
              cursor: canContinue ? "pointer" : "not-allowed",
            }}
            disabled={!canContinue}
          >
            Tiếp tục
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <p className="entry-fineprint">
            Thông tin chỉ dùng để cấp chứng chỉ và không được chia sẻ bên ngoài Droppii.
          </p>
        </form>
      </div>
    </div>
  );
}
