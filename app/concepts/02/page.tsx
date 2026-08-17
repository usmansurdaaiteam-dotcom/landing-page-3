import type { Metadata } from "next";
import { Report } from "@/components/concepts/c02/Report";
import { ConceptSwitcher } from "@/components/navigation/ConceptSwitcher";

export const metadata: Metadata = {
  title: "Concept 02 — Deliverables Report · Daffy Studio",
  description:
    "A luxury project report where every number is real and every thumbnail opens into full-bleed evidence.",
};

export default function Concept02() {
  return (
    <main>
      <Report />
      <ConceptSwitcher />
    </main>
  );
}
