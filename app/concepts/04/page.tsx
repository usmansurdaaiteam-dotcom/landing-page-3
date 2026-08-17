import type { Metadata } from "next";
import { Player } from "@/components/concepts/c04/Player";
import { ConceptSwitcher } from "@/components/navigation/ConceptSwitcher";

export const metadata: Metadata = {
  title: "Concept 04 — Stage Player · Daffy Studio",
  description:
    "Four chapters — source, studio, lifestyle, film — that play themselves until you take over.",
};

export default function Concept04() {
  return (
    <main>
      <Player />
      <ConceptSwitcher />
    </main>
  );
}
