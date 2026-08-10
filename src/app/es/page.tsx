import type { Metadata } from "next";
import KillLipeHome from "../../components/KillLipeHome";

export const metadata: Metadata = {
  title: "KILL LIPE | Canal de Videojuegos",
  description:
    "Sitio oficial de KILL LIPE. Gameplays, guías y cobertura de lanzamientos para el público brasileño.",
};

export default function Page() {
  return <KillLipeHome initialLocale="es" />;
}
