import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background selection:bg-primary/20 grid min-h-screen w-full lg:grid-cols-2">
      <div className="flex flex-col items-center justify-center p-8">
        {children}
      </div>
      <div className="relative hidden h-full w-full p-3 lg:block">
        <div className="bg-background relative h-full w-full overflow-hidden rounded-xl">
          <Image
            src="/auth-cover.png"
            alt="OpsFlow abstract cover"
            fill
            className="object-cover opacity-70"
            priority
          />
          <div className="from-background/80 via-background/10 absolute inset-0 bg-linear-to-tr to-transparent" />
          <div className="from-background/90 absolute inset-0 bg-linear-to-t via-transparent to-transparent" />
        </div>
      </div>
    </div>
  );
}
