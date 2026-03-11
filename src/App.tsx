import { useState } from "react";

const components = {
  A: { label: "SDK", sub: "Capture / Encrypt", color: "#22d3ee" },
  B: { label: "BIZZ App", sub: "Hosted App / Plugin", color: "#818cf8" },
  C: { label: "BIZZ Monolith", sub: "Core Application", color: "#f59e0b" },
  D: { label: "Payment Gateway", sub: "Bridge C ↔ E", color: "#34d399" },
  E: { label: "Serfinsa", sub: "Payment Processor", color: "#f87171" },
};

const integrations = [
  {
    id: "paylinks",
    label: "Payment Links",
    icon: "🔗",
    risk: "Cardholder data not encrypted before API submission",
    solution: "Encrypt all card data via SDK before sending to API",
    flow: ["A", "B", "C", "D", "E"],
    pciScope: ["A", "B", "D"],
    questions: [
      "Which API endpoint receives encrypted data — BIZZ Monolith (C)?",
      "Is the payment form fully hosted on teip.io / bizz.io?",
      "Who encrypts: SDK (A) or hosted app (B)?",
      "What happens to data through C → D → E?",
      "Does Serfinsa accept encrypted or decrypted payloads?",
      "Who decrypts for Serfinsa if needed — Gateway (D)?",
      "What encryption algorithm will be used?",
      "Who issues and manages encryption keys?",
    ],
  },
  {
    id: "cardpresent",
    label: "Card-Present (POS)",
    icon: "💳",
    risk: "POS hardware exposure without end-to-end encryption",
    solution: "SDK encrypts at POS device level before API transmission",
    flow: ["A", "B", "C", "D", "E"],
    pciScope: ["A", "B", "D"],
    questions: [
      "Which API accepts the encrypted payment data — Monolith (C)?",
      "Who encrypts: SDK (A) or POS app (B)?",
      "Lifecycle of encrypted data through C, D, E?",
      "Does Serfinsa process encrypted or decrypted data?",
      "Who decrypts for Serfinsa if Gateway (D) handles it?",
      "What encryption algorithm will be used?",
      "Who controls access to encryption keys (software + personnel)?",
      "All components touching cardholder data must be PCI-DSS compliant",
    ],
  },
  {
    id: "wordpress",
    label: "WordPress Plugin",
    icon: "🔌",
    risk: "Open-source environment; operators can tamper with plugin code",
    solution: "BIZZ-controlled modal + SDK isolates card entry from WP host",
    flow: ["A", "B", "C", "D", "E"],
    pciScope: ["A", "B", "D"],
    questions: [
      "How to prevent JS interception of card data within WordPress?",
      "Where is the modal hosted — BIZZ servers or WP host?",
      "Which script encrypts the data, and what algorithm is used?",
      "Where are keys stored, who issues them, and how to invalidate?",
    ],
  },
  {
    id: "customapi",
    label: "Custom API Integration",
    icon: "⚙️",
    risk: "No control over third-party front-end; SDK can be manipulated",
    solution: "SDK + hosted modal keeps card capture fully under BIZZ control",
    flow: ["A", "B", "C", "D", "E"],
    pciScope: ["A", "D"],
    questions: [
      "How to prevent SDK manipulation by third-party developers?",
      "Where is the modal hosted — custom site or BIZZ service?",
      "Which script encrypts, algorithm used, key issuance & invalidation?",
      "How will BIZZ audit integrations to verify secure implementation?",
    ],
  },
];

export default function App() {
  const [active, setActive] = useState("paylinks");
  const current = integrations.find((i) => i.id === active);

  return (
    <div style={{
      fontFamily: "'Georgia', serif",
      background: "#0f172a",
      minHeight: "100vh",
      color: "#e2e8f0",
      padding: "24px",
    }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            fontSize: 11,
            letterSpacing: "0.2em",
            color: "#64748b",
            textTransform: "uppercase",
            marginBottom: 8,
          }}>PCI-DSS BIZZ · Iteration #1</div>
          <h1 style={{
            fontSize: 28,
            fontWeight: "bold",
            background: "linear-gradient(90deg, #22d3ee, #818cf8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: 0,
          }}>Payment Security Risk Overview</h1>
          <p style={{ color: "#64748b", fontSize: 13, marginTop: 8 }}>
            Select an integration type to explore risks, data flow, and open questions
          </p>
        </div>

        {/* Tab Selector */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 8,
          marginBottom: 28,
        }}>
          {integrations.map((i) => (
            <button
              key={i.id}
              onClick={() => setActive(i.id)}
              style={{
                background: active === i.id ? "#1e293b" : "transparent",
                border: active === i.id ? "1px solid #334155" : "1px solid #1e293b",
                borderRadius: 8,
                padding: "10px 8px",
                cursor: "pointer",
                color: active === i.id ? "#e2e8f0" : "#64748b",
                fontSize: 12,
                textAlign: "center",
                transition: "all 0.2s",
              }}
            >
              <div style={{ fontSize: 20, marginBottom: 4 }}>{i.icon}</div>
              <div style={{ fontWeight: active === i.id ? "bold" : "normal" }}>{i.label}</div>
            </button>
          ))}
        </div>

        {/* Main Panel */}
        <div style={{
          background: "#1e293b",
          borderRadius: 12,
          border: "1px solid #334155",
          overflow: "hidden",
        }}>
          {/* Risk + Solution */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            borderBottom: "1px solid #334155",
          }}>
            <div style={{ padding: 20, borderRight: "1px solid #334155" }}>
              <div style={{ fontSize: 10, letterSpacing: "0.15em", color: "#f87171", textTransform: "uppercase", marginBottom: 6 }}>⚠ Risk</div>
              <p style={{ margin: 0, fontSize: 13, color: "#cbd5e1", lineHeight: 1.6 }}>{current.risk}</p>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ fontSize: 10, letterSpacing: "0.15em", color: "#34d399", textTransform: "uppercase", marginBottom: 6 }}>✓ Proposed Solution</div>
              <p style={{ margin: 0, fontSize: 13, color: "#cbd5e1", lineHeight: 1.6 }}>{current.solution}</p>
            </div>
          </div>

          {/* Data Flow */}
          <div style={{ padding: 24, borderBottom: "1px solid #334155" }}>
            <div style={{ fontSize: 10, letterSpacing: "0.15em", color: "#94a3b8", textTransform: "uppercase", marginBottom: 16 }}>Data Flow</div>
            <div style={{ display: "flex", alignItems: "center", gap: 0, flexWrap: "wrap" }}>
              {current.flow.map((key, idx) => {
                const comp = components[key];
                const inScope = current.pciScope.includes(key);
                return (
                  <div key={key} style={{ display: "flex", alignItems: "center" }}>
                    <div style={{
                      background: "#0f172a",
                      border: `2px solid ${inScope ? comp.color : "#334155"}`,
                      borderRadius: 8,
                      padding: "10px 14px",
                      textAlign: "center",
                      minWidth: 90,
                      position: "relative",
                    }}>
                      {inScope && (
                        <div style={{
                          position: "absolute",
                          top: -8,
                          right: -8,
                          background: "#f59e0b",
                          color: "#0f172a",
                          fontSize: 9,
                          fontWeight: "bold",
                          padding: "2px 5px",
                          borderRadius: 4,
                          letterSpacing: "0.05em",
                        }}>PCI</div>
                      )}
                      <div style={{ fontSize: 11, fontWeight: "bold", color: comp.color }}>{key}</div>
                      <div style={{ fontSize: 12, color: "#e2e8f0", marginTop: 2 }}>{comp.label}</div>
                      <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>{comp.sub}</div>
                    </div>
                    {idx < current.flow.length - 1 && (
                      <div style={{ color: "#334155", fontSize: 20, margin: "0 4px" }}>→</div>
                    )}
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 14, display: "flex", gap: 16, alignItems: "center" }}>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: "#f59e0b" }}></div>
                <span style={{ fontSize: 11, color: "#94a3b8" }}>PCI-DSS In Scope</span>
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: "#334155" }}></div>
                <span style={{ fontSize: 11, color: "#94a3b8" }}>Out of Scope</span>
              </div>
            </div>
          </div>

          {/* Questions */}
          <div style={{ padding: 24 }}>
            <div style={{ fontSize: 10, letterSpacing: "0.15em", color: "#94a3b8", textTransform: "uppercase", marginBottom: 16 }}>Open Questions for Technical Team</div>
            <div style={{ display: "grid", gap: 8 }}>
              {current.questions.map((q, i) => (
                <div key={i} style={{
                  display: "flex",
                  gap: 12,
                  padding: "10px 14px",
                  background: "#0f172a",
                  borderRadius: 6,
                  border: "1px solid #1e293b",
                  alignItems: "flex-start",
                }}>
                  <div style={{
                    minWidth: 22,
                    height: 22,
                    background: "#1e293b",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    color: "#818cf8",
                    fontWeight: "bold",
                    flexShrink: 0,
                    marginTop: 1,
                  }}>{i + 1}</div>
                  <span style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.6 }}>{q}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div style={{
          marginTop: 20,
          padding: "14px 20px",
          background: "#1e293b",
          borderRadius: 8,
          border: "1px solid #334155",
          fontSize: 12,
          color: "#64748b",
          lineHeight: 1.7,
        }}>
          <strong style={{ color: "#f59e0b" }}>⚠ PCI-DSS Scope Note:</strong> Any component that can save, access, or log cardholder data must be fully PCI-DSS compliant and subject to audit. The goal is to minimize the number of in-scope components. Failure to comply can result in revocation of the processing license.
        </div>
      </div>
    </div>
  );
}