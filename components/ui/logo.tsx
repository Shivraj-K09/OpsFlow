import * as React from "react";

export function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 2.66663L29.3333 16L16 29.3333L2.66667 16L16 2.66663ZM16 7.42805L7.4281 16L16 24.5719L24.5719 16L16 7.42805Z"
        fill="currentColor"
      />
    </svg>
  );
}
