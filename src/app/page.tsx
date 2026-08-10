import type { Metadata } from "next";
import KillLipeHome from "../components/KillLipeHome";

export const metadata: Metadata = {
  title: "KILL LIPE | Canal de Games",
  description:
    "Site oficial do KILL LIPE. Gameplays, guias e cobertura de lançamentos em português.",
};

export default function Page() {
  return <KillLipeHome initialLocale="pt-BR" />;
}
