"use client";

import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { IconBrandGoogleFilled, IconMail, IconHexagonFilled } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";

export default function Login() {
  const [showEmailForm, setShowEmailForm] = useState(false);

  return (
    <div className="flex w-full max-w-[360px] flex-col gap-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col items-center gap-2 text-center">
        <IconHexagonFilled className="size-10 text-primary" />
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground">
          Log in to your OpsFlow account
        </p>
      </div>

      <div className="flex flex-col w-full">
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
              <div className="flex flex-col gap-4 w-full pb-1">
                <Button variant="default" className="h-11 w-full">
                  <IconBrandGoogleFilled className="mr-2 size-4" />
                  Continue with Google
                </Button>

                <Button
                  variant="outline"
                  className="h-11 w-full"
                  onClick={() => setShowEmailForm(true)}
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
              <div className="flex flex-col gap-6 w-full pt-1">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className="h-11"
                    />
                  </Field>

                  <Field>
                    <div className="flex items-center justify-between">
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <Link
                        href="#"
                        className="text-sm font-medium hover:underline text-muted-foreground transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <Input id="password" type="password" className="h-11" />
                  </Field>
                </FieldGroup>

                <Button variant="default" className="h-11 w-full">
                  Sign In
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => setShowEmailForm(false)}
                  className="text-muted-foreground hover:text-foreground h-11 transition-colors"
                >
                  Back to options
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-2 text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-foreground hover:underline transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-sm"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
