import { Suspense } from "react";
import { IconLoader2 } from "@tabler/icons-react";
import { RegisterForm } from "@/components/register-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a new OpsFlow account",
};

export default function Register() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center p-8">
          <IconLoader2 className="text-muted-foreground animate-spin" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
