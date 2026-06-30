"use client";

import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "./Chrome";
import { asset } from "@/lib/config";

export function SiteHeader() {
  return (
    <header className="topbar">
      {/* Back to the main portfolio. Point this at your deployed portfolio URL. */}
      <a className="tb-back" href="/" aria-label="Back to work">
        <ArrowLeft size={16} />
        Back to <span className="amber">&nbsp;work</span>
      </a>
      <a className="tb-brand" href="/" aria-label="DAYAL·WORLD — home">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset("/UX.DS_white.svg")} alt="UX.DS" />
      </a>
      <div
        style={{
          justifySelf: "end",
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
        }}
      >
        <span className="tb-tag">Case Study</span>
        <ThemeToggle />
      </div>
    </header>
  );
}
