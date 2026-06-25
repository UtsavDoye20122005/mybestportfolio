import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminSessionFromCookieValue } from "@/lib/contact/admin";
import AdminLoginForm from "./AdminLoginForm";

export const metadata = {
  title: "Lead Vault Login",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function SecretInboxLoginPage() {
  const cookieStore = await cookies();
  const session = getAdminSessionFromCookieValue(cookieStore.get("lead_vault_session")?.value);

  if (session) {
    redirect("/secret/inbox");
  }

  return (
    <section className="mx-auto max-w-4xl px-4 pb-12 md:px-6">
      <header className="border-x border-[var(--rule)] px-4 pt-10 pb-8 md:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--muted)]">
          Secret / Inbox / Login
        </p>
        <h1 className="mt-4 font-sans text-4xl tracking-[-0.02em] sm:text-5xl md:text-6xl">
          Admin access.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)]">
          Sign in to review the submissions captured by your portfolio backend.
        </p>
      </header>

      <div className="border-x border-[var(--rule)] px-4 py-10 md:px-10">
        <div className="mx-auto max-w-lg">
          <AdminLoginForm />
        </div>
      </div>
    </section>
  );
}
