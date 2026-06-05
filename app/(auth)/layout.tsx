import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2 bg-background selection:bg-primary/20">
      <div className="flex flex-col justify-center items-center p-8">
        {children}
      </div>
      <div className="hidden lg:block relative w-full h-full p-3">
        <div className="relative w-full h-full overflow-hidden rounded-xl bg-background">
          <Image
            src="/auth-cover.png"
            alt="OpsFlow abstract cover"
            fill
            className="object-cover opacity-70"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-tr from-background/80 via-background/10 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-t from-background/90 via-transparent to-transparent" />
        </div>
      </div>
    </div>
  );
}
