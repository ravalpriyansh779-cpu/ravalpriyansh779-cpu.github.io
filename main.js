const state = { attack: false, approved: false, executed: false };

const rows = [
  ["11:32:01", "10.0.1.10", "10.0.2.10", "Modbus/TCP", "Normal", "0.12"],
  ["11:32:02", "10.0.1.11", "10.0.2.20", "OPC-UA", "Normal", "0.18"],
  ["11:32:03", "10.0.1.20", "10.0.2.30", "MQTT", "Normal", "0.09"],
  ["11:32:04", "10.0.1.50", "10.0.2.10", "Modbus/TCP", "Threat", "0.96"],
  ["11:32:05", "10.0.1.20", "10.0.2.30", "MQTT", "Normal", "0.11"],
  ["11:32:06", "10.0.1.11", "10.0.2.20", "OPC-UA", "Suspicious", "0.61"],
  ["11:32:07", "10.0.1.10", "10.0.2.10", "Modbus/TCP", "Normal", "0.22"],
  ["11:32:08", "10.0.1.50", "10.0.2.10", "Modbus/TCP", "Threat", "0.91"]
];

function badge(s) {
  const cls = s === "Threat" ? "pbad" : s === "Suspicious" ? "pwarn" : "pgood";
  return `<span class="pill ${cls}">${s}</span>`;
}

function table() {
  return `<table><tr><th>TIME</th><th>SOURCE</th><th>DESTINATION</th><th>PROTOCOL</th><th>THREAT SCORE</th><th>CLASS</th></tr>
    ${rows.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[5]}</td><td>${badge(r[4])}</td></tr>`).join("")}
  </table>`;
}

function hero(title, sub, btn = "") {
  return `<div class="hero"><div><div class="eyebrow">IIoT SECURITY PLATFORM / INTERACTIVE DEMO</div><h2>${title}</h2><p>${sub}</p></div>${btn}</div>`;
}

function page(t, s, b) {
  return hero(t, s) + b;
}

function show(v, btn) {
  document.querySelectorAll("nav button").forEach(x => x.classList.remove("active"));
  if (btn) btn.classList.add("active");
  const a = document.getElementById("app");

  if (v === "dashboard") {
    a.innerHTML = hero(
      "Command Center",
      "Autonomous industrial cyber defense // telemetry → cognition → controlled response",
      `<button class="btn danger" onclick="inject()">⚡ INJECT SIMULATED THREAT</button>`
    ) + `
    <div class="cards">
      <div class="card"><div class="label">PACKETS ANALYZED</div><div class="value cyan">1,284</div></div>
      <div class="card red"><div class="label">THREATS DETECTED</div><div class="value redtxt">${state.attack ? "07" : "04"}</div></div>
      <div class="card"><div class="label">ASSETS MONITORED</div><div class="value amber">24</div></div>
      <div class="card"><div class="label">CONTROL PLANE</div><div class="value green">TRUSTED</div></div>
    </div>
    <div class="panel"><h3>◈ COGNITIVE DEFENSE PIPELINE</h3><div class="pipeline">
      ${["EDGE GATEWAY","TRAFFIC AI","HYBRID IDS","XAI","THREAT CONTEXT","AGENTIC AI","POLICY GATE","DUAL-MCU"]
        .map(x => `<div class="stage"><b>✓</b>${x}</div>`).join("")}
    </div></div>
    <div class="grid">
      <div>
        <div class="panel"><h3>⌁ LIVE THREAT MATRIX</h3>${table()}</div>
        <div class="panel"><h3>▤ DEFENSE EVENT LOG</h3><div class="log">
          <span class="g">[OK]</span> Gateway telemetry synchronized<br>
          <span class="c">[AI]</span> Hybrid feature vector updated<br>
          <span class="g">[OK]</span> Firmware attestation: VALID<br>
          ${state.attack
            ? '<span class="r">[ALERT]</span> Unauthorized Modbus burst detected<br><span class="r">[ALERT]</span> PLC-07 threat score: 0.96<br><span class="c">[XAI]</span> Attribution generated<br>'
            : '<span class="c">[SYS]</span> Awaiting simulated threat injection<br>'}
        </div></div>
      </div>
      <div>
        <div class="panel"><h3>◎ THREAT RADAR</h3><div class="radar">
          <div class="cross x"></div><div class="cross y"></div><div class="sweep"></div>
          <div class="blip b1"></div><div class="blip b2"></div>
          <span style="font:700 9px Orbitron;color:#4d7079">ICS / SECTOR-07</span>
        </div></div>
        <div class="panel"><h3>▣ INCIDENT TIMELINE</h3><div class="timeline">
          ${state.attack
            ? '<div class="event d"><div class="time">11:32:04</div><p><b>HOSTILE TRAFFIC</b><br>Modbus burst / PLC-07</p></div><div class="event"><div class="time">11:32:05</div><p>Context correlation complete</p></div><div class="event"><div class="time">11:32:06</div><p>Policy gate engaged</p></div>'
            : '<div class="event"><div class="time">SYSTEM</div><p>Grid nominal. No active incident.</p></div>'}
        </div></div>
      </div>
    </div>`;
  }

  if (v === "traffic") {
    a.innerHTML = page("Traffic Matrix", "Edge acquisition // packet-flow telemetry // protocol parsing", `
      <div class="panel"><h3>PACKET / FLOW TELEMETRY</h3>${table()}</div>
      <div class="grid">
        <div class="panel"><h3>TRAFFIC VOLUME</h3><div style="height:180px;display:flex;align-items:end;gap:3px">
          ${Array.from({ length: 52 }, (_, i) => `<div style="flex:1;height:${15 + Math.random() * 150}px;background:${i % 7 === 3 ? "#ff164f" : "#00a9bc"};opacity:.75"></div>`).join("")}
        </div></div>
        <div class="panel"><h3>PROTOCOL MIX</h3>
          ${[["MODBUS/TCP", 35], ["OPC-UA", 25], ["MQTT", 25], ["HTTP", 15]]
            .map(x => `<div style="font-size:11px;margin:14px 0">${x[0]} <span style="float:right">${x[1]}%</span><div class="bar"><div class="fill" style="width:${x[1]}%"></div></div></div>`).join("")}
        </div>
      </div>`);
  }

  if (v === "ids") {
    a.innerHTML = page("Hybrid IDS Core", "Multi-signal anomaly detection // autoencoder + temporal model + LightGBM", `
      <div class="cards">
        <div class="card"><div class="label">AUTOENCODER</div><div class="value amber">0.71</div></div>
        <div class="card"><div class="label">LSTM TEMPORAL</div><div class="value amber">0.78</div></div>
        <div class="card red"><div class="label">LIGHTGBM</div><div class="value redtxt">0.93</div></div>
        <div class="card red"><div class="label">HYBRID DECISION</div><div class="value redtxt">${state.attack ? "0.96" : "0.72"}</div></div>
      </div>
      <div class="panel"><h3>THREAT CONFIDENCE VECTOR</h3>
        <div class="bar"><div class="fill red" style="width:${state.attack ? 96 : 72}%"></div></div>
        <p style="font:700 11px Orbitron;color:#ff5978;margin-top:13px">THREAT / ACTION THRESHOLD: 0.72</p>
      </div>`);
  }

  if (v === "xai") {
    a.innerHTML = page("Explainable AI", "Analyst-readable attribution // SHAP-style feature contribution", `
      <div class="panel"><h3>WHY PLC-07 WAS FLAGGED</h3>
        ${[["PACKET VOLUME", 91], ["BURST RATE", 86], ["FAILED AUTHENTICATION", 78], ["MODBUS CONTEXT", 54], ["CONNECTION DURATION", 38]]
          .map(x => `<div style="margin:18px 0;font-size:11px">${x[0]} <span style="float:right;color:#77949d">${x[1]}%</span><div class="bar"><div class="fill red" style="width:${x[1]}%"></div></div></div>`).join("")}
        <div style="border:1px solid #2b1720;background:#10090d;padding:14px;color:#b8cdd2;font-size:11px">
          <b style="color:#ff5978">MODEL EXPLANATION //</b> Abnormal traffic volume, burst behavior, and authentication context dominate the decision.
        </div>
      </div>`);
  }

  if (v === "context") {
    a.innerHTML = page("Threat Context", "Cross-domain correlation // network + firmware + access + asset graph", `
      <div class="grid">
        <div class="panel"><h3>CORRELATED EVIDENCE</h3><div class="kv">
          ${[["NETWORK","Modbus/TCP burst"],["ASSET","PLC-07"],["ACCESS","Unknown RFID badge"],["FIRMWARE","v2.4.1 / VALID"],["RUNTIME","ATTESTATION VALID"],["SAFETY","Pump-03 control"]]
            .map(x => `<div><small>${x[0]}</small><strong>${x[1]}</strong></div>`).join("")}
        </div></div>
        <div class="panel"><h3>KNOWLEDGE GRAPH</h3>
          <p>UNKNOWN BADGE → ACCESSED → CONTROL ROOM</p>
          <p>PLC-07 → CONTROLS → PUMP-03</p>
          <p>PLC-07 → COMMUNICATES VIA → MODBUS/TCP</p>
        </div>
      </div>`);
  }

  if (v === "agent") {
    a.innerHTML = page("Agentic Reasoner", "Context retrieval → reasoning → bounded action planning", `
      <div class="panel"><h3>AUTONOMOUS RESPONSE PLAN</h3>
        ${["RETRIEVE affected asset context","VALIDATE firmware trust state","CHECK policy for Modbus anomaly","RECOMMEND network isolation","REQUEST human approval","ISSUE bounded control-plane command"]
          .map((x, i) => `<div style="padding:14px;border-bottom:1px solid #142d35;font-size:12px"><b style="color:#00eaff;font-family:Orbitron">${String(i + 1).padStart(2, "0")}</b>&nbsp;&nbsp;${x}</div>`).join("")}
        <p class="subline" style="margin-top:18px">ARBITRARY COMMAND EXECUTION: DISABLED // ONLY PREDEFINED ACTIONS ARE PERMITTED</p>
      </div>`);
  }

  if (v === "firmware") {
    a.innerHTML = page("Firmware Trust", "Runtime integrity // secure boot // signed OTA // anti-rollback", `
      <div class="panel"><h3>PLC-07 TRUST CHAIN</h3><table>
        ${[["SECURE BOOT","VALID"],["SIGNED OTA IMAGE","VALID"],["ANTI-ROLLBACK","ENABLED"],["RUNTIME INTEGRITY","VALID"],["RE-ATTESTATION","VALID"]]
          .map(x => `<tr><td>${x[0]}</td><td class="green"><b>${x[1]}</b></td></tr>`).join("")}
      </table></div>`);
  }

  if (v === "policy") {
    a.innerHTML = page("Policy Gate", "Tiered action authority // human approval // audit barrier", `
      <div class="cards">
        <div class="card red"><div class="label">THREAT</div><div class="value redtxt">CRITICAL</div></div>
        <div class="card"><div class="label">RESPONSE</div><div class="value amber">ISOLATE</div></div>
        <div class="card"><div class="label">HUMAN APPROVAL</div><div class="value ${state.approved ? "green" : "redtxt"}">${state.approved ? "GRANTED" : "REQUIRED"}</div></div>
      </div>
      <div class="panel"><h3>AUTHORITY GATE</h3>
        <p style="color:#829da5;font-size:12px">Physical actuation remains blocked until independent policy and human-approval conditions are satisfied.</p>
        <button class="btn" onclick="approve()">${state.approved ? "✓ APPROVAL GRANTED" : "GRANT BOUNDED CONTAINMENT"}</button>
      </div>`);
  }

  if (v === "mcu") {
    a.innerHTML = page("Dual-MCU Control", "Independent communications and safety authority // hardware security boundary", `
      <div class="grid">
        <div class="panel"><h3>⬢ MCU-B / COMMUNICATIONS</h3><div class="kv">
          ${[["COMMAND","ISOLATE"],["POLICY TOKEN","VALID"],["SOURCE","AI SENTINEL"],["LINK","AUTHENTICATED"]]
            .map(x => `<div><small>${x[0]}</small><strong>${x[1]}</strong></div>`).join("")}
        </div></div>
        <div class="panel"><h3>⬢ MCU-A / SAFETY AUTHORITY</h3><div class="kv">
          ${[["FIRMWARE TRUST","VALID"],["SAFETY INTERLOCK","VALID"],["HUMAN APPROVAL",state.approved ? "VALID" : "MISSING"],["ACTUATION",state.approved ? "AUTHORIZED" : "BLOCKED"]]
            .map(x => `<div><small>${x[0]}</small><strong class="${["BLOCKED","MISSING"].includes(x[1]) ? "redtxt" : "green"}">${x[1]}</strong></div>`).join("")}
        </div></div>
      </div>
      <div class="panel">
        ${state.executed
          ? '<h3 class="green">✓ SAFE-STATE ISOLATION EXECUTED // SIMULATION</h3>'
          : `<h3>INDEPENDENT ACTUATION GATE</h3><p style="color:#829da5;font-size:12px">MCU-A independently validates trust and approval before permitting the predefined safe-state action.</p><button class="btn ${state.approved ? "" : "danger"}" onclick="execute()">${state.approved ? "🔒 EXECUTE SAFE-STATE ISOLATION" : "🔒 ACTUATION BLOCKED"}</button>`}
      </div>`);
  }

  if (v === "forensics") {
    a.innerHTML = page("Forensics / Replay", "Incident timeline // evidence export // analyst reconstruction", `
      <div class="panel"><h3>INCIDENT EVIDENCE LOG</h3>
        ${state.attack
          ? `<div class="timeline">
              <div class="event d"><div class="time">11:32:04</div><p>THREAT DETECTED — score 0.96</p></div>
              <div class="event"><div class="time">11:32:05</div><p>Firmware trust validated</p></div>
              <div class="event"><div class="time">11:32:06</div><p>Policy evaluation completed</p></div>
              <div class="event"><div class="time">11:32:07</div><p>Human approval ${state.approved ? "GRANTED" : "PENDING"}</p></div>
            </div><br><button class="btn" onclick="downloadEvidence()">⬇ EXPORT EVIDENCE JSON</button>`
          : '<div style="padding:30px;text-align:center;color:#526f79">NO INCIDENTS LOGGED YET.</div>'}
      </div>`);
  }
}

function inject() {
  state.attack = true;
  document.getElementById("threat").textContent = "CRITICAL";
  document.getElementById("threat").style.color = "#ff164f";
  document.getElementById("json").textContent = JSON.stringify({
    source: "10.0.1.50",
    destination: "10.0.2.10",
    protocol: "Modbus/TCP",
    event: "Unauthorized write + burst traffic",
    threat_score: 0.96,
    status: "DETECTED"
  }, null, 2);
  document.getElementById("modal").style.display = "flex";
  show("dashboard", document.querySelector("nav button"));
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

function approve() {
  state.approved = true;
  show("policy", document.querySelectorAll("nav button")[7]);
}

function execute() {
  if (!state.approved) return;
  state.executed = true;
  show("mcu", document.querySelectorAll("nav button")[8]);
}

function downloadEvidence() {
  const e = {
    incident: "SIM-001",
    timestamp: new Date().toISOString(),
    threat_score: 0.96,
    source: "10.0.1.50",
    protocol: "Modbus/TCP",
    firmware_trust: "VALID",
    human_approval: state.approved,
    action: state.executed ? "SAFE_STATE_ISOLATE_EXECUTED" : "PENDING"
  };
  const b = new Blob([JSON.stringify(e, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(b);
  a.download = "iiot_incident_evidence.json";
  a.click();
}

document.addEventListener("DOMContentLoaded", () => {
  show("dashboard", document.querySelector("nav button"));
});
