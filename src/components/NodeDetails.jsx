import React from "react";

export default function NodeDetails({ hop }) {
  if (!hop) return <div className="sub">No node selected.</div>;

  return (
    <>
      <div className="header">
        <div>
          <div className="title">Node Details</div>
          <div className="sub">Hop {hop.hop} • {hop.ip}</div>
        </div>
      </div>

      <div className="kv">
        <div>IP</div><div>{hop.ip ?? "—"}</div>
        <div>Hop</div><div>{hop.hop ?? "—"}</div>
        <div>RTT</div><div>{hop.rtt != null ? `${hop.rtt} ms` : "—"}</div>
        <div>City</div><div>{hop.city ?? "—"}</div>
        <div>ASN</div><div>{hop.asn ?? "—"}</div>
        <div>Latitude</div><div>{hop.lat ?? "—"}</div>
        <div>Longitude</div><div>{hop.lon ?? "—"}</div>
      </div>
    </>
  );
}
