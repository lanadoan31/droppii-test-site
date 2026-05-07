import { DroppiiLogo, IconChat } from "./Brand";

function isAnswered(q, a) {
  if (!a) return false;
  if (q.type === "single" || q.type === "scenario") return Array.isArray(a) && a.length > 0;
  if (q.type === "multi") return Array.isArray(a) && a.length > 0;
  if (q.type === "short") return typeof a === "string" && a.trim().length > 0;
  return false;
}

export default function Test({ tweaks, seller, questions, testMeta, answers, onAnswer, currentIdx, onNav, timeLeft, onSubmit, onAbort }) {
  const q = questions[currentIdx];
  const total = questions.length;
  const primary = tweaks.primaryColor;
  const secondary = tweaks.secondaryColor;

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timeWarning = timeLeft <= 5 * 60;
  const answered = answers[q.id];
  const canProceed = isAnswered(q, answered);

  return (
    <div className="screen test" style={{ background: tweaks.bgColor }}>
      <header className="test-topbar">
        <div className="test-topbar-left">
          <DroppiiLogo color={primary} height={22} />
          <span className="test-topbar-divider" />
          <span className="test-topbar-meta">{testMeta.title}</span>
        </div>
        <div className="test-topbar-right">
          <div className={`timer ${timeWarning ? "timer-warning" : ""}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="13" r="8" stroke="currentColor" strokeWidth="2" />
              <path d="M12 9v4l2.5 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M9 2h6M12 5V2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>{String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}</span>
          </div>
          <button className="btn-ghost" onClick={onAbort}>Thoát</button>
        </div>
      </header>

      <div className="progress-strip">
        <div className="progress-strip-info">
          <span>Câu <strong>{currentIdx + 1}</strong> / {total}</span>
          <span
            className="topic-tag"
            style={{ color: primary, borderColor: `${primary}55`, background: `${primary}10` }}
          >
            <IconChat size={11} color={primary} /> {q.topicLabel}
          </span>
        </div>
        <div className="progress-dots">
          {questions.map((qq, i) => {
            const ans = isAnswered(qq, answers[qq.id]);
            const isCurrent = i === currentIdx;
            return (
              <button
                key={qq.id}
                className={`pdot ${isCurrent ? "current" : ""} ${ans ? "answered" : ""}`}
                onClick={() => onNav(i)}
                style={{
                  background: isCurrent ? primary : ans ? secondary : "transparent",
                  borderColor: isCurrent ? primary : ans ? secondary : "#D7D9DD",
                  color: isCurrent || ans ? "#fff" : "#6B7280",
                }}
                aria-label={`Câu ${i + 1}`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>

      <main className="question-area">
        <div className={`q-card ${tweaks.density === "compact" ? "compact" : ""}`}>
          <div className="q-eyebrow">
            Câu {currentIdx + 1}
            <span
              className="q-type-badge"
              style={{ background: `${primary}12`, color: primary, borderColor: `${primary}33` }}
            >
              {q.type === "single" && "Chọn 1 đáp án"}
              {q.type === "multi" && "Chọn nhiều đáp án"}
              {q.type === "short" && "Trả lời ngắn"}
              {q.type === "scenario" && "Tình huống"}
            </span>
          </div>

          {q.type === "scenario" && q.scenario && (
            <div className="scenario-bubble" style={{ borderLeftColor: secondary }}>
              <div className="scenario-customer">
                <div className="cust-avatar" style={{ background: `${secondary}22`, color: secondary }}>K</div>
                <div>
                  <div className="cust-label">Khách hàng nhắn</div>
                  <div className="cust-msg">{q.scenario.customer}</div>
                </div>
              </div>
              {q.scenario.hint && (
                <div className="scenario-hint">
                  <IconChat size={12} color={primary} />
                  <span>{q.scenario.hint}</span>
                </div>
              )}
            </div>
          )}

          <h2 className="q-prompt">{q.prompt}</h2>

          {(q.type === "single" || q.type === "scenario") && (
            <div className="options">
              {q.options.map((opt, i) => {
                const checked = (answered || []).includes(opt.id);
                return (
                  <label
                    key={opt.id}
                    className={`option ${checked ? "checked" : ""}`}
                    style={checked ? { borderColor: primary, background: `${primary}08` } : {}}
                  >
                    <span
                      className="option-letter"
                      style={checked ? { background: primary, color: "#fff", borderColor: primary } : {}}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="option-text">{opt.text}</span>
                    <input
                      type="radio"
                      name={`q${q.id}`}
                      checked={checked}
                      onChange={() => onAnswer(q.id, [opt.id])}
                      style={{ display: "none" }}
                    />
                  </label>
                );
              })}
            </div>
          )}

          {q.type === "multi" && (
            <div className="options">
              {q.options.map((opt, i) => {
                const arr = answered || [];
                const checked = arr.includes(opt.id);
                const toggle = () => {
                  if (checked) onAnswer(q.id, arr.filter((x) => x !== opt.id));
                  else onAnswer(q.id, [...arr, opt.id]);
                };
                return (
                  <label
                    key={opt.id}
                    className={`option ${checked ? "checked" : ""}`}
                    style={checked ? { borderColor: primary, background: `${primary}08` } : {}}
                  >
                    <span
                      className="option-check"
                      style={checked ? { background: primary, borderColor: primary } : {}}
                    >
                      {checked && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M5 12l5 5L20 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span className="option-text">{opt.text}</span>
                    <input type="checkbox" checked={checked} onChange={toggle} style={{ display: "none" }} />
                  </label>
                );
              })}
              <div className="multi-hint">Có thể có nhiều hơn một đáp án đúng.</div>
            </div>
          )}

          {q.type === "short" && (
            <div className="short-area">
              <textarea
                className="short-textarea"
                placeholder={q.placeholder || "Viết câu trả lời của bạn..."}
                value={answered || ""}
                onChange={(e) => onAnswer(q.id, e.target.value)}
                rows={5}
                style={{ borderColor: (answered || "").length > 0 ? primary : "#D7D9DD" }}
              />
              <div className="short-meta">
                <span>{(answered || "").length} ký tự</span>
                {q.rubric && (
                  <details className="rubric">
                    <summary>Tiêu chí chấm</summary>
                    <ul>
                      {q.rubric.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </details>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="q-footer">
          <button
            className="btn-ghost"
            onClick={() => onNav(Math.max(0, currentIdx - 1))}
            disabled={currentIdx === 0}
          >
            ← Câu trước
          </button>
          <div className="q-footer-spacer" />
          {currentIdx < total - 1 ? (
            <button
              className="btn-primary"
              onClick={() => onNav(currentIdx + 1)}
              style={{
                background: canProceed ? primary : "#C9CBD0",
                boxShadow: canProceed ? `0 6px 18px -8px ${primary}` : "none",
                cursor: canProceed ? "pointer" : "not-allowed",
              }}
              disabled={!canProceed}
            >
              Câu tiếp theo →
            </button>
          ) : (
            <button
              className="btn-primary"
              onClick={onSubmit}
              style={{
                background: canProceed ? secondary : "#C9CBD0",
                boxShadow: canProceed ? `0 6px 18px -8px ${secondary}` : "none",
                cursor: canProceed ? "pointer" : "not-allowed",
              }}
              disabled={!canProceed}
            >
              Nộp bài
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
