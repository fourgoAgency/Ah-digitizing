export function GetQuoteBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <svg className="absolute inset-0 h-full w-full text-primary/20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <g id="tool-scissor" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="7" cy="7" r="2.5" />
            <circle cx="13" cy="7" r="2.5" />
            <path d="M8.8 8.8 16 16M11.2 8.8 4 16" />
          </g>
          <g id="tool-ruler" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
            <rect x="2" y="4" width="16" height="6" rx="1.2" />
            <path d="M5 6v2M8 6v2M11 6v2M14 6v2M17 6v2" />
          </g>
          <g id="tool-spool" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 4h8M6 16h8M5 6h10v8H5z" />
            <path d="M7 8h6M7 10h6M7 12h6" />
          </g>
          <g id="tool-machine" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 13h14v3H3zM4 9h7V5h3l2 2v6M9 9v4M6 13V9" />
          </g>
          <g id="tool-pin" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 13a6 6 0 1 1 12 0z" />
            <path d="M7 10.5v-2M10 10v-3M13 10.5v-2" />
            <circle cx="7" cy="7.5" r=".7" fill="currentColor" />
            <circle cx="10" cy="6.5" r=".7" fill="currentColor" />
            <circle cx="13" cy="7.5" r=".7" fill="currentColor" />
          </g>
          <g id="tool-needle" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 15 15 4M12.5 6.5l2 2M3.5 14.5c2 0 2.5 1.5 4.5 1.5" />
          </g>
          <pattern id="sewing-pattern" width="420" height="420" patternUnits="userSpaceOnUse" patternTransform="rotate(-20)">
            <use href="#tool-machine" transform="translate(28 30) scale(1.9)" />
            <use href="#tool-scissor" transform="translate(210 56) scale(1.9)" />
            <use href="#tool-ruler" transform="translate(318 38) scale(1.9)" />
            <use href="#tool-pin" transform="translate(86 228) scale(1.9)" />
            <use href="#tool-needle" transform="translate(282 246) scale(1.9)" />
            <use href="#tool-spool" transform="translate(184 340) scale(1.9)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#sewing-pattern)" />
      </svg>
    </div>
  );
}
