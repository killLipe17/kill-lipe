import type { Metadata } from "next";
import KillLipeHome from "../../components/KillLipeHome";

export const metadata: Metadata = {
  title: "KILL LIPE | Gaming Channel",
  description:
    "Official KILL LIPE website. Gameplay, guides and launch coverage for Brazilian audiences.",
};

export default function Page() {
  return <KillLipeHome initialLocale="en" />;
}
