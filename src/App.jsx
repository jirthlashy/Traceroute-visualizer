import React, { useMemo, useState } from "react";
import { sampleTrace } from "./data/sampleTrace";
import CesiumMap from "./components/CesiumMap";
import NodePanel from "./components/NodePanel";
import NodeDetails from "./components/NodeDetails";

export default function App() {
  const [trace] = useState(sampleTrace);

  // selected hop index (0-based)
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedHop = useMemo(() => {
    return trace.hops[selectedIndex] ?? null;
  }, [trace, selectedIndex]);

  return (
    <div className="app">
      <div className="left">
        <div className="section">
          <NodePanel
            trace={trace}
            selectedIndex={selectedIndex}
            onSelectIndex={setSelectedIndex}
          />
        </div>

        <div className="section" style={{ borderTop: "1px solid rgba(255,255,255,0.10)" }}>
          <NodeDetails hop={selectedHop} />
        </div>
      </div>

      <div className="right">
        <CesiumMap
          trace={trace}
          selectedIndex={selectedIndex}
          onSelectIndex={setSelectedIndex}
        />
      </div>
    </div>
  );
}
