"use client";

import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { IconSearch } from "@tabler/icons-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export function SearchInput({ placeholder }: { placeholder: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [query, setQuery] = useState(searchParams.get("q") || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (query) {
        params.set("q", query);
      } else {
        params.delete("q");
      }
      router.push(`${pathname}?${params.toString()}`);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, pathname, router, searchParams]);

  return (
    <div className="relative w-full sm:w-80">
      <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      <InputGroup className="h-9">
        <InputGroupInput 
          placeholder={placeholder} 
          className="pl-9 text-sm" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </InputGroup>
    </div>
  );
}
