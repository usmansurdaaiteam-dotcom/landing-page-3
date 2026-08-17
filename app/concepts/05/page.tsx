import type { Metadata } from "next";
import { Explorer } from "@/components/concepts/c05/Explorer";
import { ConceptSwitcher } from "@/components/navigation/ConceptSwitcher";

export const metadata: Metadata = {
  title: "Concept 05 — Category Explorer · Daffy Studio",
  description:
    "Categories breathe — the one you open takes the room, the rest wait as labeled bars. Built to hold 200+ products.",
};

export default function Concept05() {
  return (
    <main>
      <Explorer />
      <ConceptSwitcher />
    </main>
  );
}
