"use client";

import { useEffect, useId, useState } from "react";

// A ```mermaid block in a note, drawn as a diagram in the app's look (SPEC §6.7): flat, square,
// neutral boxes on the raised panel, grey lines, white text. Mermaid (~1 MB) loads only on a note
// that has one. If the diagram doesn't parse, its text shows as code instead.

type Mermaid = (typeof import("mermaid"))["default"];
let loading: Promise<Mermaid> | null = null;

function load(): Promise<Mermaid> {
  loading ??= import("mermaid").then(({ default: mermaid }) => {
    const css = getComputedStyle(document.documentElement);
    const font = css.getPropertyValue("--font-plex-sans").trim() || "IBM Plex Sans, system-ui, sans-serif";
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "strict",
      theme: "base",
      fontFamily: font,
      flowchart: { curve: "basis", htmlLabels: true, nodeSpacing: 28, rankSpacing: 34, padding: 10 },
      // Mermaid mixes these hexes itself, so they're literal copies of the tokens in globals.css.
      themeVariables: {
        fontFamily: font,
        fontSize: "13px",
        background: "#0d0f14",
        primaryColor: "#141720",
        primaryTextColor: "#f3f5fa",
        primaryBorderColor: "#5d6576",
        secondaryColor: "#141720",
        tertiaryColor: "#0d0f14",
        lineColor: "#98a0b2",
        textColor: "#c2c8d4",
        edgeLabelBackground: "#0d0f14",
        clusterBkg: "#0d0f14",
        clusterBorder: "#2a2f3b",
        noteBkgColor: "#141720",
        noteTextColor: "#f3f5fa",
        noteBorderColor: "#2a2f3b",
        actorBkg: "#141720",
        actorBorder: "#5d6576",
        actorTextColor: "#f3f5fa",
        signalColor: "#98a0b2",
        signalTextColor: "#c2c8d4",
      },
    });
    return mermaid;
  });
  return loading;
}

export function MermaidDiagram({ code }: { code: string }) {
  const id = `mmd-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const [drawn, setDrawn] = useState<{ code: string; svg: string | null } | null>(null);

  useEffect(() => {
    let gone = false;
    load()
      .then((m) => m.render(id, code))
      .then(({ svg }) => !gone && setDrawn({ code, svg }))
      .catch(() => {
        document.getElementById(id)?.remove(); // mermaid leaves its error drawing in the body
        if (!gone) setDrawn({ code, svg: null });
      });
    return () => {
      gone = true;
    };
  }, [code, id]);

  const result = drawn?.code === code ? drawn : null;
  if (result && result.svg === null) {
    return (
      <pre>
        <code>{code}</code>
      </pre>
    );
  }
  return (
    <figure className="mermaid-fig" aria-label="Diagram">
      {result?.svg ? <div className="mermaid-svg" dangerouslySetInnerHTML={{ __html: result.svg }} /> : <div className="mermaid-wait" />}
    </figure>
  );
}
