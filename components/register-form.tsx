"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import {
  IconBrandGoogleFilled,
  IconMail,
  IconHexagonFilled,
  IconLoader2,
  IconEye,
  IconEyeOff,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export function RegisterForm() {
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/dashboard";

  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const handleSignup = (formData: FormData) => {
    startTransition(async () => {
      setError(null);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(formData)),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Failed to sign up");
      } else {
        router.push(nextUrl);
        router.refresh();
      }
    });
  };

  const handleGoogleLogin = () => {
    startTransition(async () => {
      setError(null);
      const res = await fetch("/api/auth/google", {
        method: "POST",
        body: JSON.stringify({ nextUrl }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Failed to login with Google");
      } else if (data.url) {
        window.location.href = data.url;
      }
    });
  };

  return (
    <div className="animate-in fade-in zoom-in-95 flex w-full max-w-[360px] flex-col gap-8 duration-500">
      <div className="flex flex-col items-center gap-2 text-center">
        <IconHexagonFilled className="text-primary size-10" />
        <h1 className="text-foreground mt-2 text-2xl font-semibold tracking-tight">
          Create an account
        </h1>
        <p className="text-muted-foreground text-sm">
          Get started with OpsFlow today
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-red-500/20 bg-red-500/10 p-3 text-center text-sm text-red-500">
          {error}
        </div>
      )}

      <div className="flex w-full flex-col">
        <AnimatePresence initial={false}>
          {!showEmailForm && (
            <motion.div
              key="options"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full overflow-hidden"
            >
              <div className="flex w-full flex-col gap-4 pb-1">
                <Button
                  variant="default"
                  className="h-11 w-full"
                  onClick={handleGoogleLogin}
                  disabled={isPending}
                >
                  {isPending ? (
                    <IconLoader2 className="mr-2 size-4 animate-spin" />
                  ) : (
                    <IconBrandGoogleFilled className="mr-2 size-4" />
                  )}
                  Continue with Google
                </Button>

                <Button
                  variant="outline"
                  className="h-11 w-full"
                  onClick={() => setShowEmailForm(true)}
                  disabled={isPending}
                >
                  <IconMail className="mr-2 size-4" />
                  Continue with email
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {showEmailForm && (
            <motion.div
              key="form"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full overflow-hidden"
            >
              <form
                action={handleSignup}
                className="flex w-full flex-col gap-6 pt-1"
              >
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="name">Full Name</FieldLabel>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      className="h-11"
                      required
                      disabled={isPending}
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      className="h-11"
                      required
                      disabled={isPending}
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="h-11 pr-10"
                        required
                        disabled={isPending}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
                        disabled={isPending}
                      >
                        {showPassword ? (
                          <IconEyeOff className="size-4" />
                        ) : (
                          <IconEye className="size-4" />
                        )}
                      </button>
                    </div>
                  </Field>
                </FieldGroup>

                <Button
                  variant="default"
                  type="submit"
                  className="h-11 w-full"
                  disabled={isPending}
                >
                  {isPending ? (
                    <IconLoader2 className="mr-2 size-4 animate-spin" />
                  ) : (
                    "Sign Up"
                  )}
                </Button>

                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => setShowEmailForm(false)}
                  className="text-muted-foreground hover:text-foreground h-11 transition-colors"
                  disabled={isPending}
                >
                  Back to options
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="text-muted-foreground mt-2 text-center text-xs">
        By signing up, you agree to our{" "}
        <a
          href="#"
          className="text-foreground focus-visible:ring-ring rounded-sm font-medium whitespace-nowrap transition-colors hover:underline focus-visible:ring-1 focus-visible:outline-none"
        >
          Terms
        </a>{" "}
        and{" "}
        <a
          href="#"
          className="text-foreground focus-visible:ring-ring rounded-sm font-medium whitespace-nowrap transition-colors hover:underline focus-visible:ring-1 focus-visible:outline-none"
        >
          Privacy
        </a>
        .
      </p>

      <p className="text-muted-foreground mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link
          href={`/login?next=${encodeURIComponent(nextUrl)}`}
          className="text-foreground focus-visible:ring-ring rounded-sm font-medium transition-colors hover:underline focus-visible:ring-1 focus-visible:outline-none"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
