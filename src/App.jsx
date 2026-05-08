import { useState, useEffect } from "react";
import SellerEntry from "./components/SellerEntry";
import PreTest from "./components/PreTest";
import Test from "./components/Test";
import Result from "./components/Result";
import Certificate from "./components/Certificate";
import { getTestsForUser, adaptForSeller, getLatestPublishedTest } from "./data/testStore";
import { saveTestResult } from "./data/resultStore";
import TestSelect from "./components/TestSelect";

const BRANCH_PRESETS = {
  marketplace: { primaryColor: "#F26B1F", secondaryColor: "#1E73BE", bgColor: "#FAF7F2" },
  business: { primaryColor: "#1E73BE", secondaryColor: "#F26B1F", bgColor: "#F4F7FB" },
  mix: { primaryColor: "#F26B1F", secondaryColor: "#1E73BE", bgColor: "#FAF7F2" },
  warm: { primaryColor: "#E5572A", secondaryColor: "#2A6E9E", bgColor: "#FBF4ED" },
};

const DEFAULT_TWEAKS = {
  primaryColor: "#F26B1F",
  secondaryColor: "#1E73BE",
  bgColor: "#FAF7F2",
  density: "comfortable",
  branchPreset: "mix",
};

export default function App() {
  // Seller identity — name entered at entry screen, used as userId for assignment filtering.
  // Persisted in sessionStorage so it survives a page reload within the session.
  const [sellerUserId, setSellerUserId] = useState(
    () => sessionStorage.getItem('droppii_seller_userId') || ''
  );

  // selectedTest holds the adapted { questions, testMeta } for the active test.
  // Initialized from the latest published admin test; null if none exists yet.
  const [selectedTest, setSelectedTest] = useState(() => {
    const t = getLatestPublishedTest();
    if (t) console.log('[Seller] Initial test loaded from admin:', t.id, t.title);
    else    console.log('[Seller] No published admin test found — selectedTest is null');
    return t ? adaptForSeller(t) : null;
  });
  const [allTests, setAllTests] = useState(() => {
    const uid = sessionStorage.getItem('droppii_seller_userId') || '';
    const tests = getTestsForUser(uid);
    console.log('[Seller] Initial allTests load:', tests.length, 'test(s) for uid:', uid || '(none)');
    return tests;
  });

  const [tweaks, setTweaksState] = useState(DEFAULT_TWEAKS);
  const [stage, setStage] = useState("entry"); // entry | select | pretest | test | result | cert
  const [seller, setSeller] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(30 * 60); // overwritten when a test is selected

  const { questions = [], testMeta = {} } = selectedTest ?? {};

  const setTweak = (keyOrEdits, val) => {
    setTweaksState((prev) => {
      const edits = typeof keyOrEdits === "object" ? keyOrEdits : { [keyOrEdits]: val };
      return { ...prev, ...edits };
    });
  };

  useEffect(() => {
    if (stage !== "test") return;
    const t = setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          setStage("result");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [stage]);

  const handleSellerContinue = (sellerInfo) => {
    setSeller(sellerInfo);
    const userId = sellerInfo.name.trim();
    sessionStorage.setItem('droppii_seller_userId', userId);
    setSellerUserId(userId);
    const tests = getTestsForUser(userId);
    setAllTests(tests);
    console.log('[Seller] Logged in as:', userId, '→', tests.length, 'available test(s):', tests.map(t => t.id));
    setStage(tests.length === 0 ? "empty" : "select");
  };

  const handleSelectTest = (exportedTest) => {
    const adapted = adaptForSeller(exportedTest);
    console.log('[Seller] Test selected — source: admin, id:', exportedTest.id, 'title:', exportedTest.title);
    setSelectedTest(adapted);
    setTimeLeft(adapted.testMeta.durationMinutes * 60);
    setStage("pretest");
  };

  const handleStart = () => {
    setAnswers({});
    setCurrentIdx(0);
    setTimeLeft(testMeta.durationMinutes * 60);
    setStage("test");
  };

  const handleAnswer = (qid, val) => setAnswers((a) => ({ ...a, [qid]: val }));

  const handleSubmit = () => {
    // compute score and persist result
    let correct = 0;
    questions.forEach((q) => {
      const a = answers[q.id];
      if (q.type === "short") {
        if (typeof a === "string" && a.trim().length >= 30) correct++;
      } else {
        const arr = Array.isArray(a) ? [...a].sort() : [];
        const expected = [...(q.correct || [])].sort();
        if (JSON.stringify(arr) === JSON.stringify(expected)) correct++;
      }
    });
    const score = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;
    const resultPayload = {
      testId:         testMeta.id,
      testTitle:      testMeta.title,
      userName:       seller?.name || "Nhà bán hàng",
      userId:         sellerUserId || seller?.id || "DRP-SLR-00000",
      score,
      passed:         score >= (testMeta.passingScore ?? 70),
      correctCount:   correct,
      totalQuestions: questions.length,
      submittedAt:    new Date().toISOString(),
      answers,
      questions,
    };
    console.log('[Seller] Submitting result → testId:', resultPayload.testId, 'userId:', resultPayload.userId, 'score:', score);
    saveTestResult(resultPayload);
    setStage("result");
  };

  const handleAbort = () => {
    if (window.confirm("Bạn có chắc muốn thoát? Bài làm sẽ không được lưu.")) {
      setStage("pretest");
    }
  };

  const handleReview = () => {
    document.querySelector(".review-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const demoSeller = seller || { name: "Nhà bán hàng", id: "DRP-SLR-00000", branch: "Sàn thương mại" };

  return (
    <>
      {stage === "entry" && (
        <SellerEntry tweaks={tweaks} onContinue={handleSellerContinue} />
      )}
      {stage === "empty" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", gap: 12, fontFamily: "inherit" }}>
          <p style={{ color: "#666", fontSize: 15, margin: 0 }}>No test available. Please contact admin.</p>
          <button onClick={() => setStage("entry")} style={{ fontSize: 13, color: "#888", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>← Back</button>
        </div>
      )}
      {stage === "select" && (
        <TestSelect tweaks={tweaks} seller={demoSeller} tests={allTests} onSelect={handleSelectTest} />
      )}
      {stage === "pretest" && selectedTest && (
        <PreTest tweaks={tweaks} seller={demoSeller} testMeta={testMeta} onStart={handleStart} />
      )}
      {stage === "test" && selectedTest && (
        <Test
          tweaks={tweaks}
          seller={demoSeller}
          questions={questions}
          testMeta={testMeta}
          answers={answers}
          onAnswer={handleAnswer}
          currentIdx={currentIdx}
          onNav={setCurrentIdx}
          timeLeft={timeLeft}
          onSubmit={handleSubmit}
          onAbort={handleAbort}
        />
      )}
      {stage === "result" && (
        <Result
          tweaks={tweaks}
          questions={questions}
          testMeta={testMeta}
          answers={answers}
          onReview={handleReview}
          onCertificate={() => setStage("cert")}
          onRetry={handleStart}
        />
      )}
      {stage === "cert" && (
        <Certificate
          tweaks={tweaks}
          seller={demoSeller}
          questions={questions}
          answers={answers}
          onBack={() => setStage("result")}
        />
      )}

      <TweaksPanel tweaks={tweaks} setTweak={setTweak} stage={stage} setStage={setStage} />
    </>
  );
}

function TweaksPanel({ tweaks, setTweak, stage, setStage }) {
  const [open, setOpen] = useState(false);

  const onPreset = (p) => {
    const preset = BRANCH_PRESETS[p];
    setTweak({ ...preset, branchPreset: p });
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 2147483645,
          background: tweaks.primaryColor,
          color: "#fff",
          border: 0,
          borderRadius: "999px",
          padding: "10px 18px",
          fontWeight: 600,
          fontSize: 13,
          cursor: "pointer",
          boxShadow: `0 4px 16px -4px ${tweaks.primaryColor}`,
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontFamily: '"Be Vietnam Pro", system-ui, sans-serif',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="3" stroke="#fff" strokeWidth="2" />
          <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </svg>
        Tweaks
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 60,
            right: 16,
            zIndex: 2147483646,
            width: 280,
            maxHeight: "calc(100vh - 80px)",
            display: "flex",
            flexDirection: "column",
            background: "rgba(250,249,247,.92)",
            color: "#29261b",
            backdropFilter: "blur(24px) saturate(160%)",
            WebkitBackdropFilter: "blur(24px) saturate(160%)",
            border: ".5px solid rgba(255,255,255,.6)",
            borderRadius: 14,
            boxShadow: "0 1px 0 rgba(255,255,255,.5) inset, 0 12px 40px rgba(0,0,0,.18)",
            font: "11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 8px 10px 14px" }}>
            <b style={{ fontSize: 12, fontWeight: 600 }}>Tweaks</b>
            <button
              onClick={() => setOpen(false)}
              style={{ appearance: "none", border: 0, background: "transparent", color: "rgba(41,38,27,.55)", width: 22, height: 22, borderRadius: 6, cursor: "pointer", fontSize: 13 }}
            >
              ✕
            </button>
          </div>
          <div style={{ padding: "2px 14px 14px", display: "flex", flexDirection: "column", gap: 14, overflowY: "auto" }}>
            <Section label="Brand branch">
              <SegControl
                label="Preset"
                value={tweaks.branchPreset}
                options={[
                  { value: "marketplace", label: "Sàn TM" },
                  { value: "business", label: "Business" },
                  { value: "mix", label: "Mix" },
                  { value: "warm", label: "Warm" },
                ]}
                onChange={onPreset}
              />
              <ColorRow label="Primary" value={tweaks.primaryColor} onChange={(v) => setTweak("primaryColor", v)} />
              <ColorRow label="Secondary" value={tweaks.secondaryColor} onChange={(v) => setTweak("secondaryColor", v)} />
              <ColorRow label="Background" value={tweaks.bgColor} onChange={(v) => setTweak("bgColor", v)} />
            </Section>

            <Section label="Layout">
              <SegControl
                label="Density"
                value={tweaks.density}
                options={[
                  { value: "comfortable", label: "Comfort" },
                  { value: "compact", label: "Compact" },
                ]}
                onChange={(v) => setTweak("density", v)}
              />
            </Section>

            <Section label="Jump to screen">
              <SegControl
                label="Stage"
                value={stage}
                options={[
                  { value: "entry",   label: "Entry" },
                  { value: "select",  label: "Select" },
                  { value: "pretest", label: "Intro" },
                  { value: "test",    label: "Test" },
                  { value: "result",  label: "Result" },
                  { value: "cert",    label: "Cert" },
                ]}
                onChange={(v) => setStage(v)}
              />
            </Section>
          </div>
        </div>
      )}
    </>
  );
}

function Section({ label, children }) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: "rgba(41,38,27,.45)", marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {children}
      </div>
    </div>
  );
}

function SegControl({ label, value, options, onChange }) {
  const idx = Math.max(0, options.findIndex((o) => o.value === value));
  const n = options.length;
  return (
    <div>
      <div style={{ fontSize: 11, color: "rgba(41,38,27,.6)", marginBottom: 4 }}>{label}</div>
      <div style={{ position: "relative", display: "flex", padding: 2, borderRadius: 8, background: "rgba(0,0,0,.06)" }}>
        <div
          style={{
            position: "absolute",
            top: 2,
            bottom: 2,
            left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
            width: `calc((100% - 4px) / ${n})`,
            borderRadius: 6,
            background: "rgba(255,255,255,.9)",
            boxShadow: "0 1px 2px rgba(0,0,0,.12)",
            transition: "left .15s cubic-bezier(.3,.7,.4,1)",
          }}
        />
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            style={{
              appearance: "none",
              position: "relative",
              zIndex: 1,
              flex: 1,
              border: 0,
              background: "transparent",
              color: "inherit",
              font: "inherit",
              fontWeight: 500,
              minHeight: 22,
              borderRadius: 6,
              cursor: "pointer",
              padding: "4px 6px",
              lineHeight: 1.2,
            }}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ColorRow({ label, value, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontSize: 11, color: "rgba(41,38,27,.72)", fontWeight: 500 }}>{label}</span>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          appearance: "none",
          WebkitAppearance: "none",
          width: 56,
          height: 22,
          border: ".5px solid rgba(0,0,0,.1)",
          borderRadius: 6,
          padding: 0,
          cursor: "pointer",
          background: "transparent",
        }}
      />
    </div>
  );
}
