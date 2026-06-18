"use client";
// SheetList — home page. Shows the two double-sided sheets.
// Replaces the old MenuList (which listed individual menus).

import Link from "next/link";
import type { SheetConfig } from "@/sheets/sheetConfig";

interface Props {
  sheets: SheetConfig[];
  /** Overridden sheet titles keyed by sheet id. Falls back to sheet.name. */
  sheetTitles?: Record<string, string>;
}

export default function SheetList({ sheets, sheetTitles = {} }: Props) {
  return (
    <div style={{ maxWidth: 600, margin: "48px auto", padding: "0 16px" }}>
      <h1 style={{ fontFamily: "serif", marginBottom: 8 }}>
        Pelican Club — Menu Editor
      </h1>
      <p style={{ color: "#666", marginBottom: 24, fontSize: "0.9em" }}>
        Each card is a double-sided sheet. Click to edit or preview either side.
      </p>

      {sheets.length === 0 && (
        <p style={{ color: "#aaa" }}>No sheets configured.</p>
      )}

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {sheets.map((sheet) => (
          <li key={sheet.id} style={{ marginBottom: 10 }}>
            <Link
              href={`/sheet/${sheet.id}`}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 20px",
                border: "1px solid #ddd",
                borderRadius: 8,
                textDecoration: "none",
                color: "inherit",
                background: "#fff",
                transition: "border-color 0.15s",
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: "1.05em" }}>
                  {sheetTitles[sheet.id] ?? sheet.name}
                </div>
                <div style={{ fontSize: "0.8em", color: "#888", marginTop: 3 }}>
                  Front: {sheet.front.label} &nbsp;·&nbsp; Back:{" "}
                  {sheet.back.label}
                </div>
              </div>
              <span style={{ color: "#aaa", fontSize: "0.85em" }}>Open →</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
