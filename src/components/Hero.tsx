import React from 'react';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-[#0b0c0f] px-6 py-6 sm:px-12 sm:py-8">
      {/* Background abstract orange waves */}
      <svg
        className="absolute right-0 bottom-0 w-3/4 h-full pointer-events-none opacity-40 z-0"
        viewBox="0 0 300 160"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="hg" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fe6601" stopOpacity="0" />
            <stop offset="0.55" stopColor="#fe6601" stopOpacity="0.55" />
            <stop offset="1" stopColor="#ff8c2e" />
          </linearGradient>
        </defs>
        <path d="M0 160 C90 150 170 120 230 70 C260 45 280 20 300 0 L300 160Z" fill="url(#hg)" opacity="0.35" />
        <path d="M40 160 C130 150 200 115 250 75 C272 57 288 40 300 28 L300 160Z" fill="url(#hg)" opacity="0.55" />
        <path d="M90 160 C170 152 230 125 270 95 C283 85 293 76 300 70" fill="none" stroke="#ff8c2e" strokeWidth="3" />
      </svg>

      <div className="relative z-10 max-w-4xl mx-auto">
        <h1 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl leading-[1.06] tracking-tight uppercase text-white mb-2 italic">
          ANALISI ESIGENZE <br />
          <span className="text-[#fe6601] drop-shadow-[0_0_18px_rgba(254,102,1,0.35)]">
            NEGOZI WINDTRE
          </span>
        </h1>
        <p className="text-sm sm:text-base text-[#e6e8ec] max-w-xs sm:max-w-md font-medium">
          Insieme per offrirti la soluzione più adatta al tuo business.
        </p>
      </div>
    </section>
  );
};
