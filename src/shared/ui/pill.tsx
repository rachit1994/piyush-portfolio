import type { ReactNode } from "react";

type PillProps = {
  children: ReactNode;
  dot?: string;
};

export function Pill({ children, dot }: PillProps) {
  return (
    <span className="pill">
      {dot ? <i aria-hidden="true" style={{ background: dot }} /> : null}
      {children}
    </span>
  );
}
