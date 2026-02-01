import React from "react";

export default function NodePanel({ trace, selectedIndex, onSelectIndex }) {
  return (
    <>
      <div className="header">
        <div>
          <div className="title">Jumped Nodes</div>
          <div className="sub">
            {trace.source} → {trace.target} • {trace.hops.length} hops
          </div>
        </div>
      </div>

      <div className="list">
        {trace.hops.map((h, idx) => (
          <div
            key={h.hop ?? idx}
            className={`item ${idx === selectedIndex ? "active" : ""}`}
            onClick={() => onSelectIndex(idx)}
            title="Click to select"
          >
            <div className="row">
              <strong>Hop {h.hop ?? idx + 1}</strong>
              <span>{h.rtt != null ? `${h.rtt} ms` : "—"}</span>
            </div>
            <div className="row">
              <span>{h.ip}</span>
              <span>{h.city ?? "—"}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
