import type { Metadata } from "next";
import { Canvas } from "@/components/concepts/c01/Canvas";
import { ConceptSwitcher } from "@/components/navigation/ConceptSwitcher";

export const metadata: Metadata = {
  title: "Concept 01 — Transformation Canvas · Daffy Studio",
  description:
    "One living canvas. Stages expand and contract around whichever part of the transformation you touch.",
};

export default function Concept01() {
  return (
    <main>
      <Canvas />
      <ConceptSwitcher />
    </main>
  );
}
