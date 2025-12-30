import { useState } from "react";
import viteLogo from "/vite.svg";
import cloudflareLogo from "@/shared/assets/Cloudflare_Logo.svg";
import honoLogo from "@/shared/assets/hono.svg";
import reactLogo from "@/shared/assets/react.svg";

export function HomePage() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("unknown");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      {/* Logo section */}
      <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mb-8">
        <a
          href="https://vite.dev"
          target="_blank"
          rel="noreferrer"
          className="transition-all duration-300 hover:drop-shadow-[0_0_2em_rgba(100,108,255,0.67)]"
        >
          <img src={viteLogo} className="h-16 md:h-24 p-4 md:p-6" alt="Vite logo" />
        </a>
        <a
          href="https://react.dev"
          target="_blank"
          rel="noreferrer"
          className="transition-all duration-300 hover:drop-shadow-[0_0_2em_rgba(97,218,251,0.67)] motion-safe:animate-spin motion-safe:[animation-duration:20s]"
        >
          <img src={reactLogo} className="h-16 md:h-24 p-4 md:p-6" alt="React logo" />
        </a>
        <a
          href="https://hono.dev/"
          target="_blank"
          rel="noreferrer"
          className="transition-all duration-300 hover:drop-shadow-[0_0_2em_rgba(246,130,31,0.67)]"
        >
          <img src={honoLogo} className="h-16 md:h-24 p-4 md:p-6" alt="Hono logo" />
        </a>
        <a
          href="https://workers.cloudflare.com/"
          target="_blank"
          rel="noreferrer"
          className="transition-all duration-300 hover:drop-shadow-[0_0_2em_rgba(246,130,31,0.67)]"
        >
          <img src={cloudflareLogo} className="h-16 md:h-24 p-4 md:p-6" alt="Cloudflare logo" />
        </a>
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-center">
        Vite + React + Hono + Cloudflare
      </h1>

      {/* Counter card */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 md:p-8 mb-4 max-w-2xl w-full shadow-lg">
        <button
          type="button"
          onClick={() => setCount((count) => count + 1)}
          aria-label="increment"
          className="w-full md:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg mb-4"
        >
          count is {count}
        </button>
        <p className="text-gray-300 text-sm md:text-base">
          Edit{" "}
          <code className="bg-gray-700/70 px-2 py-1 rounded text-indigo-300 font-mono text-sm">
            pages/home/ui/HomePage.tsx
          </code>{" "}
          and save to test HMR
        </p>
      </div>

      {/* API card */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 md:p-8 mb-8 max-w-2xl w-full shadow-lg">
        <button
          type="button"
          onClick={() => {
            fetch("/api/")
              .then((res) => res.json() as Promise<{ name: string }>)
              .then((data) => setName(data.name));
          }}
          aria-label="get name"
          className="w-full md:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg mb-4"
        >
          Name from API is: {name}
        </button>
        <p className="text-gray-300 text-sm md:text-base">
          Edit{" "}
          <code className="bg-gray-700/70 px-2 py-1 rounded text-indigo-300 font-mono text-sm">
            worker/index.ts
          </code>{" "}
          to change the name
        </p>
      </div>

      {/* Footer */}
      <p className="text-gray-500 text-sm text-center">Click on the logos to learn more</p>
    </div>
  );
}
