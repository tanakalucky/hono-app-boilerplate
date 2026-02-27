import viteLogo from "/vite.svg";
import { useState } from "react";

import cloudflareLogo from "@/shared/assets/Cloudflare_Logo.svg";
import reactLogo from "@/shared/assets/react.svg";

export function HomePage() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
      {/* Logo section */}
      <div className="mb-8 flex flex-wrap items-center justify-center gap-4 md:gap-8">
        <a
          href="https://vite.dev"
          target="_blank"
          rel="noreferrer"
          className="transition-all duration-300 hover:drop-shadow-[0_0_2em_rgba(100,108,255,0.67)]"
        >
          <img src={viteLogo} className="h-16 p-4 md:h-24 md:p-6" alt="Vite logo" />
        </a>
        <a
          href="https://react.dev"
          target="_blank"
          rel="noreferrer"
          className="transition-all duration-300 hover:drop-shadow-[0_0_2em_rgba(97,218,251,0.67)] motion-safe:animate-spin motion-safe:animation-duration-[20s]"
        >
          <img src={reactLogo} className="h-16 p-4 md:h-24 md:p-6" alt="React logo" />
        </a>
        <a
          href="https://workers.cloudflare.com/"
          target="_blank"
          rel="noreferrer"
          className="transition-all duration-300 hover:drop-shadow-[0_0_2em_rgba(246,130,31,0.67)]"
        >
          <img src={cloudflareLogo} className="h-16 p-4 md:h-24 md:p-6" alt="Cloudflare logo" />
        </a>
      </div>

      {/* Title */}
      <h1 className="mb-8 text-center text-3xl font-bold md:text-4xl lg:text-5xl">
        Vite + React + Cloudflare
      </h1>

      {/* Counter card */}
      <div className="mb-4 w-full max-w-2xl rounded-xl bg-gray-800/50 p-6 shadow-lg backdrop-blur-sm md:p-8">
        <button
          type="button"
          onClick={() => setCount((count) => count + 1)}
          aria-label="increment"
          className="mb-4 w-full rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white shadow-md transition-all duration-200 hover:bg-indigo-700 hover:shadow-lg active:bg-indigo-800 md:w-auto"
        >
          count is {count}
        </button>
        <p className="text-sm text-gray-300 md:text-base">
          Edit
          <code className="rounded bg-gray-700/70 px-2 py-1 font-mono text-sm text-indigo-300">
            pages/home/ui/HomePage.tsx
          </code>
          and save to test HMR
        </p>
      </div>

      {/* Footer */}
      <p className="text-center text-sm text-gray-500">Click on the logos to learn more</p>
    </div>
  );
}
