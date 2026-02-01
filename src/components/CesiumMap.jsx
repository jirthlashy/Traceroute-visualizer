import React, { useEffect, useMemo, useRef } from "react";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

function colorForRtt(rtt) {
  if (rtt == null) return Cesium.Color.GRAY;
  if (rtt < 50) return Cesium.Color.LIME;
  if (rtt < 100) return Cesium.Color.YELLOW;
  if (rtt < 200) return Cesium.Color.ORANGE;
  return Cesium.Color.RED;
}

export default function CesiumMap({ trace, selectedIndex, onSelectIndex }) {
  const viewerRef = useRef(null);
  const entityByIndexRef = useRef(new Map()); // idx -> entity

  const positions = useMemo(() => {
    return trace.hops
      .filter(h => typeof h.lon === "number" && typeof h.lat === "number")
      .map(h => Cesium.Cartesian3.fromDegrees(h.lon, h.lat, 0));
  }, [trace]);

  useEffect(() => {
    // Static asset base (public/cesium)
    window.CESIUM_BASE_URL = "/cesium/";

    // Token (optional for prototype if you already set it)
    // Cesium.Ion.defaultAccessToken = "YOUR_ION_TOKEN_HERE";

    const viewer = new Cesium.Viewer("cesiumContainer", {
      timeline: false,
      animation: false,
      baseLayerPicker: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      fullscreenButton: false,
      geocoder: false,
      homeButton: true,
      infoBox: true,
      selectionIndicator: true,
    });

    viewerRef.current = viewer;

    // Click picking: click point -> select list
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction((movement) => {
      const picked = viewer.scene.pick(movement.position);
      if (Cesium.defined(picked) && picked.id?.properties?.hopIndex) {
        const idx = picked.id.properties.hopIndex.getValue() - 1; // stored 1-based
        onSelectIndex(idx);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    return () => {
      handler.destroy();
      viewer.destroy();
      viewerRef.current = null;
    };
  }, [onSelectIndex]);

  // Render trace (points + path)
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    viewer.entities.removeAll();
    entityByIndexRef.current.clear();

    // Add hop points
    trace.hops.forEach((h, idx) => {
      if (typeof h.lon !== "number" || typeof h.lat !== "number") return;

      const entity = viewer.entities.add({
        name: `Hop ${h.hop ?? idx + 1} • ${h.ip}`,
        position: Cesium.Cartesian3.fromDegrees(h.lon, h.lat, 0),
        point: {
          pixelSize: 10,
          color: colorForRtt(h.rtt),
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 1,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
        label: {
          text: String(h.hop ?? idx + 1),
          font: "12px sans-serif",
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 3,
          pixelOffset: new Cesium.Cartesian3(0, -18, 0),
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
        properties: {
          hopIndex: (h.hop ?? idx + 1),
        },
        description: `
          <div style="font-family: sans-serif">
            <div><b>Hop:</b> ${h.hop ?? idx + 1}</div>
            <div><b>IP:</b> ${h.ip ?? "—"}</div>
            <div><b>RTT:</b> ${h.rtt != null ? h.rtt + " ms" : "—"}</div>
            <div><b>City:</b> ${h.city ?? "—"}</div>
            <div><b>ASN:</b> ${h.asn ?? "—"}</div>
          </div>
        `,
      });

      entityByIndexRef.current.set(idx, entity);
    });

    // Add path polyline
    if (positions.length >= 2) {
      viewer.entities.add({
        name: "Traceroute Path",
        polyline: {
          positions,
          width: 3,
          material: Cesium.Color.CYAN,
          clampToGround: false,
        },
      });
    }

    // Fit camera
    viewer.zoomTo(viewer.entities, new Cesium.HeadingPitchRange(0, -0.6, 0));
  }, [trace, positions]);

  // Highlight selected node on map
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    // Reset all to normal size
    for (const [idx, ent] of entityByIndexRef.current.entries()) {
      if (!ent.point) continue;
      ent.point.pixelSize = idx === selectedIndex ? 14 : 10;
      ent.point.outlineWidth = idx === selectedIndex ? 2 : 1;
    }

    // Optionally fly to selected node
    const selectedEntity = entityByIndexRef.current.get(selectedIndex);
    if (selectedEntity) {
      viewer.selectedEntity = selectedEntity; // shows infoBox
      viewer.flyTo(selectedEntity, { duration: 0.8 });
    }
  }, [selectedIndex]);

  return <div id="cesiumContainer" />;
}
