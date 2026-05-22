"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push("/account");
    router.refresh();
  };

  return (
    <div className="w-full max-w-[480px] px-6">
      <div className="mb-7 text-center">
        <img src="/images/pokedopt-logo.png" alt="" width={48} height={48} className="mx-auto" />
        <h1 className="mt-3.5 font-fraunces text-[clamp(28px,4vw,40px)] font-bold leading-[1.1]">
          Welcome back, trainer.
        </h1>
        <p className="mt-1.5 text-[15px] text-pd-ink-soft">
          Sign in to see the cards you've adopted.
        </p>
      </div>

      <form onSubmit={submit} className="rounded-[20px] border-2 border-pd-ink bg-white p-7 shadow-[0_4px_0_#29261b]">
        <div className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoFocus
            />
          </div>
          <div>
            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        {error && (
          <div className="mt-3 rounded-xl border-[1.5px] border-[#f0d4c8] bg-pd-primary-soft p-2.5 text-sm text-pd-primary">
            {error}
          </div>
        )}

        <Button type="submit" full className="mt-4 w-full" disabled={loading}>
          <img src="/images/pokedopt-logo.png" alt="" width={16} height={16} />
          {loading ? "Signing in..." : "Sign in"}
        </Button>

        <div className="mt-4 text-center text-sm text-pd-ink-soft">
          New here?{" "}
          <Link href="/signup" className="font-bold text-pd-primary underline">
            Create an account
          </Link>
        </div>
      </form>

      <div className="mt-4 rounded-xl border-[1.5px] border-dashed border-pd-ink/20 bg-pd-cream p-3.5 text-center text-xs text-pd-ink-muted">
        <strong>Demo:</strong> use <code className="rounded bg-white px-1.5 py-0.5">theo@example.com</code> /{" "}
        <code className="rounded bg-white px-1.5 py-0.5">password</code> · admin:{" "}
        <code className="rounded bg-white px-1.5 py-0.5">admin@pokedopt.com</code> /{" "}
        <code className="rounded bg-white px-1.5 py-0.5">admin</code>
      </div>
    </div>
  );
}
