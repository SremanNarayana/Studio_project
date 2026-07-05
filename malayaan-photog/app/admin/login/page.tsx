"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase/client";
import { LogIn, Loader2, ShieldAlert } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sb = createSupabaseClient();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!sb) {
      setError("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local, then restart the dev server.");
      return;
    }
    setLoading(true);
    const { error } = await sb.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <div className="eyebrow mb-3">— Admin Portal</div>
        <h1 className="font-display text-4xl">Sign In</h1>
      </div>

      <form onSubmit={submit} className="glass gold-border p-8 rounded-sm space-y-5">
        <label className="block">
          <span className="text-[10px] uppercase tracking-[0.25em] text-ivory-100/50 mb-2 block">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-black/[0.03] border border-black/10 rounded-sm px-4 py-3 text-ivory-100 focus:outline-none focus:border-azure-400"
          />
        </label>
        <label className="block">
          <span className="text-[10px] uppercase tracking-[0.25em] text-ivory-100/50 mb-2 block">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-black/[0.03] border border-black/10 rounded-sm px-4 py-3 text-ivory-100 focus:outline-none focus:border-azure-400"
          />
        </label>

        {error && (
          <div className="flex items-start gap-2 text-sm text-rose-300/90 bg-rose-500/5 border border-rose-500/20 p-3 rounded-sm">
            <ShieldAlert className="h-4 w-4 mt-0.5 shrink-0" /> <span>{error}</span>
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />} Sign In
        </button>

        <p className="text-xs text-ivory-100/40 text-center pt-4 border-t border-black/5">
          New admin? Create the user in Supabase Auth, then insert their <code>auth.uid()</code> into{" "}
          <code>public.admins</code>.
        </p>
      </form>
    </div>
  );
}
