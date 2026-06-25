"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const json = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(json.error || "Login failed");
      }

      router.replace("/secret/inbox");
      router.refresh();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-md border border-[var(--rule)] bg-black/20 p-5">
      <div>
        <label className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--muted)]">
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="mt-2 w-full border border-[var(--rule)] bg-transparent px-4 py-3 font-mono text-sm outline-none focus:border-[var(--accent)]"
          placeholder="admin username"
          autoComplete="username"
        />
      </div>

      <div className="mt-4">
        <label className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--muted)]">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 w-full border border-[var(--rule)] bg-transparent px-4 py-3 font-mono text-sm outline-none focus:border-[var(--accent)]"
          placeholder="admin password"
          autoComplete="current-password"
        />
      </div>

      {error ? (
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#ff6b6b]">{error}</p>
      ) : null}

      <button
        type="submit"
        disabled={submitting || !username.trim() || !password}
        className="mt-6 w-full border border-[var(--accent)] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--accent)] transition-colors hover:bg-[var(--accent)] hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Signing in" : "Unlock lead vault"}
      </button>
    </form>
  );
}
