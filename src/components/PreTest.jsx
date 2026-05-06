import { DroppiiLogo, IconChat, BrandPattern } from "./Brand";
import { TEST_META } from "../data/questions";

export default function PreTest({ tweaks, seller, onStart }) {
  const primary = tweaks.primaryColor;
  const secondary = tweaks.secondaryColor;

  return (
    <div className="screen pretest" style={{ background: tweaks.bgColor }}>
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

      <main className="pretest-main">
        <div className="pretest-grid">
          {/* LEFT — hero card */}
          <section className="hero-card" style={{ borderColor: `${primary}22` }}>
            <div className="hero-pattern">
              <BrandPattern height={28} count={9} colors={[primary, secondary]} seed={3} />
            </div>
            <div className="hero-tag">
              <IconChat size={14} color={primary} />
              <span>Chứng chỉ AI cho Nhà bán hàng · 2026</span>
            </div>
            <h1 className="hero-title">{TEST_META.title}</h1>
            <p className="hero-sub">{TEST_META.subtitle}</p>

            <div className="hero-stats">
              <div className="stat">
                <div className="stat-label">Số câu hỏi</div>
                <div className="stat-value">{TEST_META.totalQuestions}</div>
              </div>
              <div className="stat">
                <div className="stat-label">Thời gian</div>
                <div className="stat-value">{TEST_META.durationMinutes} phút</div>
              </div>
              <div className="stat">
                <div className="stat-label">Đạt</div>
                <div className="stat-value">≥ {TEST_META.passingScore}%</div>
              </div>
              <div className="stat">
                <div className="stat-label">Lần thử</div>
                <div className="stat-value">3 / ngày</div>
              </div>
            </div>

            <div className="topics">
              <div className="topics-label">Nội dung kiểm tra</div>
              <div className="topic-pills">
                {TEST_META.topics.map((t, i) => (
                  <span
                    key={t.id}
                    className="topic-pill"
                    style={{
                      background: i % 2 === 0 ? `${primary}12` : `${secondary}12`,
                      color: i % 2 === 0 ? primary : secondary,
                      borderColor: i % 2 === 0 ? `${primary}33` : `${secondary}33`,
                    }}
                  >
                    {t.label}
                  </span>
                ))}
              </div>
            </div>

            <button
              className="btn-primary btn-start"
              style={{ background: primary, boxShadow: `0 8px 24px -10px ${primary}` }}
              onClick={onStart}
            >
              Bắt đầu làm bài
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <p className="hero-fineprint">
              Bằng việc nhấn "Bắt đầu", bạn đồng ý làm bài độc lập, không tham khảo bên thứ ba.
            </p>
          </section>

          {/* RIGHT — rules */}
          <aside className="rules-card">
            <h2 className="rules-title">Hướng dẫn làm bài</h2>
            <ul className="rules-list">
              <li>
                <div className="rule-num" style={{ background: `${primary}18`, color: primary }}>1</div>
                <div>
                  <div className="rule-h">Mỗi câu một màn hình</div>
                  <div className="rule-d">Bạn có thể quay lại câu trước để sửa, miễn là còn thời gian.</div>
                </div>
              </li>
              <li>
                <div className="rule-num" style={{ background: `${secondary}18`, color: secondary }}>2</div>
                <div>
                  <div className="rule-h">Bộ đếm 30 phút</div>
                  <div className="rule-d">Hết giờ bài sẽ tự nộp. Đồng hồ sẽ chuyển đỏ trong 5 phút cuối.</div>
                </div>
              </li>
              <li>
                <div className="rule-num" style={{ background: `${primary}18`, color: primary }}>3</div>
                <div>
                  <div className="rule-h">Có nhiều dạng câu hỏi</div>
                  <div className="rule-d">Trắc nghiệm, chọn nhiều đáp án, viết câu trả lời ngắn, và tình huống thực tế.</div>
                </div>
              </li>
              <li>
                <div className="rule-num" style={{ background: `${secondary}18`, color: secondary }}>4</div>
                <div>
                  <div className="rule-h">Đạt ≥ 70% để nhận chứng chỉ</div>
                  <div className="rule-d">Chứng chỉ Droppii AI Seller có giá trị 12 tháng.</div>
                </div>
              </li>
            </ul>

            <div className="badge-preview">
              <div className="mini-cert" style={{ borderColor: `${primary}44` }}>
                <div className="mini-cert-stripe" style={{ background: `linear-gradient(90deg, ${primary}, ${secondary})` }} />
                <div className="mini-cert-body">
                  <div className="mini-cert-eyebrow">Chứng chỉ điện tử</div>
                  <div className="mini-cert-title">AI Seller · Level 1</div>
                  <div className="mini-cert-meta">Nhận sau khi đạt ≥ 70%</div>
                </div>
                <IconChat size={20} color={primary} />
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
