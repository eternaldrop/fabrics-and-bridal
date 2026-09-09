"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Label, Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { cloudinaryUrl } from "@/lib/cloudinary-url";

const HERO_IMAGE_ID = "fabrics-and-bridals/site/hero-fabric-rolls";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("That email and password don't match an account.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && <p key={error} className="animate-shake text-sm text-blush">{error}</p>}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Logging in..." : "Log in"}
      </Button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-cream">
      {/* Branding panel — desktop only */}
      <div className="hidden md:block relative bg-ink overflow-hidden">
        <Image
          src={cloudinaryUrl(HERO_IMAGE_ID, { width: 1400 })}
          alt="Rolls of fabric"
          fill
          priority
          sizes="50vw"
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-ink/40" />
        <div className="relative h-full flex flex-col justify-between p-12">
          <Link href="/" className="font-serif text-2xl text-cream hover:text-rose transition-colors w-fit">
            Fabrics &amp; Bridals
          </Link>
          <div>
            <p className="font-serif text-3xl text-cream leading-snug max-w-sm">
              Cloth chosen for you, cut to fit you.
            </p>
            <p className="text-cream/70 text-sm mt-3 max-w-sm">
              Sign in to manage the catalog, review consultations, and keep
              the shop running.
            </p>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 py-16 md:py-6">
        <Reveal className="w-full max-w-sm">
          <p className="text-xs text-taupe uppercase tracking-wide mb-2">Admin</p>
          <h1 className="font-serif text-3xl mb-2">Staff sign-in</h1>
          <p className="text-taupe mb-8">
            This login is for Fabrics &amp; Bridals staff. Shopping doesn&apos;t
            require an account.
          </p>

          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>

          <Link
            href="/"
            className="link-underline inline-block mt-8 text-sm text-taupe hover:text-ink transition-colors"
          >
            ← Back to the shop
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
