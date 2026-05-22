"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }

      // Auto sign in after signup
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Account created but sign in failed.");
        setLoading(false);
        return;
      }

      router.push("/account");
      router.refresh();
    } catch {
      setError("Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[480px] px-6">
      <div className="mb-7 text-center">
        <img src="/images/pokedopt-logo.png" alt="" width={48} height={48} className="mx-auto" />
        <h1 className="mt-3.5 font-fraunces text-[clamp(28px,4vw,40px)] font-bold leading-[1.1]">
          Become a trainer.
        </h1>
        <p className="mt-1.5 text-[15px] text-pd-ink-soft">
          We'll keep your adoption history all in one cozy place.
        </p>
      </div>

      <form onSubmit={submit} className="rounded-[20px] border-2 border-pd-ink bg-white p-7 shadow-[0_4px_0_#29261b]">
        <div className="space-y-4">
          <div>
            <Label>Trainer name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Theo Hollowby"
              required
              autoFocus
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 4 characters"
              required
              minLength={4}
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
          {loading ? "Creating account..." : "Create account"}
        </Button>

        <div className="mt-4 text-center text-sm text-pd-ink-soft">
          Already a trainer?{" "}
          <Link href="/login" className="font-bold text-pd-primary underline">
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}
