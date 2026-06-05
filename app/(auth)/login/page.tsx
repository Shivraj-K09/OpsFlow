import { Suspense } from "react";
import { IconLoader2 } from "@tabler/icons-react";
import { LoginForm } from "@/components/login-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Log in to your OpsFlow account",
};

export default function Login() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center p-8">
          <IconLoader2 className="text-muted-foreground animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
