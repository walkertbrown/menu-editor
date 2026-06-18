"use client";
// Menu List screen — shows all menus, links to each editor.

import Link from "next/link";
import type { Menu } from "@/content/types";

interface Props {
  menus: Menu[];
}

export default function MenuList({ menus }: Props) {
  return (
    <div style={{ maxWidth: 600, margin: "48px auto", padding: "0 16px" }}>
      <h1 style={{ fontFamily: "serif", marginBottom: 8 }}>Pelican Club — Menu Editor</h1>
      <p style={{ color: "#666", marginBottom: 24, fontSize: "0.9em" }}>
        Select a menu to edit its sections and items.
      </p>

      {menus.length === 0 && (
        <p style={{ color: "#aaa" }}>No menus found. The data file may be missing.</p>
      )}

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {menus.map((menu) => (
          <li key={menu.id} style={{ marginBottom: 10 }}>
            <Link
              href={`/menu/${menu.id}`}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px 18px",
                border: "1px solid #ddd",
                borderRadius: 8,
                textDecoration: "none",
                color: "inherit",
                background: "#fff",
                transition: "border-color 0.15s",
              }}
            >
              <span style={{ fontWeight: 600, fontSize: "1.05em" }}>{menu.name}</span>
              <span style={{ color: "#888", fontSize: "0.8em" }}>
                Updated {new Date(menu.updatedAt).toLocaleDateString()}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
