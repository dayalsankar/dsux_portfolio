import { Reveal } from "./Reveal";

export function SectionHeader({
  index,
  kicker,
  title,
  lead,
  align = "left",
}: {
  index?: string;
  kicker: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <Reveal>
        <p className="eyebrow mb-5">
          {index && (
            <span style={{ color: "var(--ink-faint)" }}>{index} · </span>
          )}
          {kicker}
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="h-section max-w-4xl" style={align === "center" ? { marginInline: "auto" } : undefined}>
          {title}
        </h2>
      </Reveal>
      {lead && (
        <Reveal delay={0.1}>
          <p
            className="lead mt-6 max-w-2xl"
            style={align === "center" ? { marginInline: "auto" } : undefined}
          >
            {lead}
          </p>
        </Reveal>
      )}
    </div>
  );
}
