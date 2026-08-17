import type { Metadata } from "next";
import { Story } from "@/components/concepts/c03/Story";
import { ConceptSwitcher } from "@/components/navigation/ConceptSwitcher";

export const metadata: Metadata = {
  title: "Concept 03 — Source to Story · Daffy Studio",
  description:
    "A narrative you scroll through. The raw warehouse photo is held on screen until your own thumb transforms it.",
};

export default function Concept03() {
  return (
    <main>
      <Story />
      <ConceptSwitcher />
    </main>
  );
}
