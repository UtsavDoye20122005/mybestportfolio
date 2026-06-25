import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminSessionFromCookieValue } from "@/lib/contact/admin";
import LeadInboxClient from "./LeadInboxClient";

export const metadata = {
  title: "Lead Vault",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function SecretInboxPage() {
  const cookieStore = await cookies();
  const session = getAdminSessionFromCookieValue(cookieStore.get("lead_vault_session")?.value);

  if (!session) {
    redirect("/secret/inbox/login");
  }

  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 md:px-6">
      <header className="border-x border-[var(--rule)] px-4 pt-10 pb-8 md:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--muted)]">
          Secret / Inbox
        </p>
        <h1 className="mt-4 font-sans text-4xl tracking-[-0.02em] sm:text-5xl md:text-6xl">
          Lead vault.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)]">
          Private review surface for contact submissions captured by your portfolio backend.
        </p>
      </header>

      <div className="border-x border-[var(--rule)] px-4 py-10 md:px-10">
        <LeadInboxClient adminUsername={session.username} />
      </div>
    </section>
  );
}
