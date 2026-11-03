"use client";

import katex from "katex";
import { useMemo } from "react";

type MathTextProps = {
  text: string;
  className?: string;
};

function renderMixed(text: string): string {
  const parts = text.split(/(\$\$[\s\S]+?\$\$|\$[^$]+?\$)/g);
  return parts
    .map((part) => {
      if (part.startsWith("$$") && part.endsWith("$$")) {
        const expr = part.slice(2, -2);
        return katex.renderToString(expr, {
          throwOnError: false,
          displayMode: true,
        });
      }
      if (part.startsWith("$") && part.endsWith("$")) {
        const expr = part.slice(1, -1);
        return katex.renderToString(expr, {
          throwOnError: false,
          displayMode: false,
        });
      }
      return part
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
    })
    .join("");
}

export function MathText({ text, className }: MathTextProps) {
  const html = useMemo(() => renderMixed(text), [text]);
  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
