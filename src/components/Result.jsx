import { useState } from "react";
import { DroppiiLogo } from "./Brand";
import { QUESTIONS, TEST_META } from "../data/questions";

function ScoreRing({ pct, primary, secondary }) {
  const r = 64;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <svg width="160" height="160" viewBox="0 0 160 160">
      <circle cx="80" cy="80" r={r} fill="none" stroke={secondary} strokeWidth="14" />
      <circle
        cx="80" cy="80" r={r} fill="none"
        stroke={primary} strokeWidth="14" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={offset}
        transform="rotate(-90 80 80)"
      />
      <text x="80" y="84" textAnchor="middle" fontSize="36" fontWeight="800" fill="#0E1116" fontFamily="Be Vietnam Pro">
        {pct}%
      </text>
      <text x="80" y="106" textAnchor="middle" fontSize="11" fill="#6B7280" fontFamily="Be Vietnam Pro">
        điểm
      </text>
    </svg>
  );
}

function ReviewItem({ g, idx, primary }) {
  const [open, setOpen] = useState(false);
  const { q, ok, manual, given } = g;

  return (
    <div className={`review-item ${ok ? "ok" : manual ? "manual" : "wrong"}`}>
      <button className="review-head" onClick={() => setOpen(!open)}>
        <span className="review-idx">Câu {idx + 1}</span>
        <span className="review-prompt">{q.prompt}</span>
        <span className={`review-status ${ok ? "ok" : manual ? "manual" : "wrong"}`}>
          {manual ? "Cần chấm tay" : ok ? "Đúng" : "Sai"}
        </span>
        <span className="review-chev" style={{ transform: open ? "rotate(180deg)" : "" }}>▾</span>
      </button>
      {open && (
        <div className="review-body">
          {q.type === "short" ? (
            <>
              <div className="rev-section">
                <div className="rev-label">Bạn trả lời</div>
                <div className="rev-quote">{given || <em>(chưa trả lời)</em>}</div>
              </div>
              <div className="rev-section">
                <div className="rev-label">Gợi ý câu trả lời tốt</div>
                <div className="rev-quote sample">{q.sample}</div>
              </div>
            </>
          ) : (
            <>
              <div className="rev-options">
                {q.options.map((o) => {
                  const isCorrect = q.correct.includes(o.id);
                  const wasChosen = (given || []).includes(o.id);
                  return (
                    <div key={o.id} className={`rev-opt ${isCorrect ? "correct" : ""} ${wasChosen && !isCorrect ? "wrong" : ""}`}>
                      <span className="rev-opt-mark">
                        {isCorrect ? "✓" : wasChosen ? "✗" : "·"}
                      </span>
                      <span>{o.text}</span>
                      {wasChosen && <span className="rev-opt-tag">Bạn chọn</span>}
                    </div>
                  );
                })}
              </div>
              <div className="rev-explanation" style={{ borderLeftColor: primary }}>
                <strong>Giải thích.</strong> {q.explanation}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function Result({ tweaks, answers, onReview, onCertificate, onRetry }) {
  const primary = tweaks.primaryColor;
  const secondary = tweaks.secondaryColor;

  const graded = QUESTIONS.map((q) => {
    const a = answers[q.id];
    if (q.type === "short") {
      const ok = typeof a === "string" && a.trim().length >= 30;
      return { q, ok, manual: true, given: a };
    }
    const arr = Array.isArray(a) ? [...a].sort() : [];
    const correct = [...q.correct].sort();
    const ok = JSON.stringify(arr) === JSON.stringify(correct);
    return { q, ok, manual: false, given: arr };
  });

  const correctCount = graded.filter((g) => g.ok).length;
  const scorePct = Math.round((correctCount / graded.length) * 100);
  const passed = scorePct >= TEST_META.passingScore;

  const topics = {};
  graded.forEach((g) => {
    const t = g.q.topic;
    if (!topics[t]) topics[t] = { ok: 0, total: 0, label: g.q.topicLabel };
    topics[t].total++;
    if (g.ok) topics[t].ok++;
  });

  const reviewRef = (el) => {
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="screen result" style={{ background: tweaks.bgColor }}>
      <header className="topbar">
        <DroppiiLogo color={primary} height={26} />
      </header>

      <main className="result-main">
        <div className="result-grid">
          <section
            className={`score-card ${passed ? "passed" : "failed"}`}
            style={{ borderColor: passed ? `${secondary}55` : "#E5B5B5" }}
          >
            <div
              className="score-stripe"
              style={{
                background: passed
                  ? `linear-gradient(90deg, ${primary}, ${secondary})`
                  : "linear-gradient(90deg, #C9302C, #E07B7B)",
              }}
            />
            <div className="score-eyebrow">
              {passed ? "🎉 Bạn đã ĐẠT bài kiểm tra" : "Bạn chưa đạt — đừng nản, thử lại nhé!"}
            </div>
            <div className="score-row">
              <div className="score-ring-wrap">
                <ScoreRing pct={scorePct} primary={passed ? secondary : "#C9302C"} secondary={`${primary}22`} />
              </div>
              <div className="score-detail">
                <div className="score-line">
                  <span className="score-label">Số câu đúng</span>
                  <span className="score-value">{correctCount} / {graded.length}</span>
                </div>
                <div className="score-line">
                  <span className="score-label">Điểm đạt yêu cầu</span>
                  <span className="score-value">{TEST_META.passingScore}%</span>
                </div>
                <div className="score-line">
                  <span className="score-label">Hoàn thành lúc</span>
                  <span className="score-value">
                    {new Date().toLocaleString("vi-VN", { dateStyle: "medium", timeStyle: "short" })}
                  </span>
                </div>
                <div className="score-actions">
                  {passed && (
                    <button
                      className="btn-primary"
                      style={{ background: primary, boxShadow: `0 8px 22px -10px ${primary}` }}
                      onClick={onCertificate}
                    >
                      Xem chứng chỉ
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  )}
                  <button className="btn-ghost-strong" onClick={onReview}>Xem lại bài</button>
                  {!passed && <button className="btn-ghost-strong" onClick={onRetry}>Làm lại</button>}
                </div>
              </div>
            </div>
          </section>

          <section className="topic-card">
            <h3 className="topic-card-title">Theo nội dung</h3>
            <div className="topic-rows">
              {Object.entries(topics).map(([id, t], i) => {
                const pct = Math.round((t.ok / t.total) * 100);
                const c = i % 2 === 0 ? primary : secondary;
                return (
                  <div key={id} className="topic-row">
                    <div className="topic-row-head">
                      <span>{t.label}</span>
                      <span className="topic-row-count">{t.ok}/{t.total}</span>
                    </div>
                    <div className="topic-row-bar">
                      <div className="topic-row-fill" style={{ width: `${pct}%`, background: c }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="next-tips">
              <div className="tips-title">Đề xuất tiếp theo</div>
              <ul>
                <li>Khoá học "Prompt cho ngành Health &amp; Wellness"</li>
                <li>Webinar: AI an toàn trong tư vấn TPCN — thứ Tư hàng tuần</li>
                <li>Tài liệu nội bộ: Bộ kiểm tra 8 bước trước khi đăng bài</li>
              </ul>
            </div>
          </section>
        </div>

        <section className="review-section" ref={reviewRef}>
          <h3 className="review-title">Tổng kết câu trả lời</h3>
          <div className="review-list">
            {graded.map((g, i) => (
              <ReviewItem key={g.q.id} g={g} idx={i} primary={primary} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
