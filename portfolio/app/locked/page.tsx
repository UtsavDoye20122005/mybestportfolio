import type { Metadata } from "next";
import { LockScreen } from "./LockScreen";

export const metadata: Metadata = {
  title: "Utsav Doye — Private",
  description: "This portfolio is private for now.",
  robots: { index: false, follow: false },
};

export default function LockedPage() {
  return <LockScreen />;
}
