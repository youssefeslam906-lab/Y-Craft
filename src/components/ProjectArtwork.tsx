import React from 'react';
import { ShowcaseSample } from '../data/studioData';

interface ProjectArtworkProps {
  sampleId: ShowcaseSample['id'];
  expanded?: boolean;
}

export const ProjectArtwork: React.FC<ProjectArtworkProps> = ({
  sampleId,
  expanded = false,
}) => {
  const heightClass = expanded ? 'h-64 sm:h-72' : 'h-52 sm:h-56';

  if (sampleId === 'clothing') {
    return (
      <div
        className={`w-full ${heightClass} rounded-xl bg-[#F4EBDD] border border-[#E2D2BE] p-4 flex flex-col justify-between select-none overflow-hidden`}
        dir="ltr"
      >
        <div className="flex items-center justify-between text-[11px] border-b border-[#E2D2BE] pb-2">
          <span className="font-display font-semibold text-[#1E1714]">KAIRO THREADS</span>
          <span className="font-mono-tabular text-[#B92708]">Bag (1)</span>
        </div>

        <div className="grid grid-cols-12 gap-3 items-center my-auto py-2">
          <div className="col-span-5 h-24 rounded-lg bg-[#E7D8C3] border border-[#D8C5AD] flex items-center justify-center">
            <svg className="w-12 h-12 text-[#1E1714]" viewBox="0 0 48 48" fill="none">
              <path
                d="M15 9L9 14L13 20L17 17V39H31V17L35 20L39 14L33 9L28 12C25.5 13.5 22.5 13.5 20 12L15 9Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="col-span-7 space-y-2">
            <div className="text-[11px] font-medium text-[#1E1714]">Heavyweight Boxy Hoodie</div>
            <div className="font-mono-tabular text-xs text-[#B92708] font-semibold">950 EGP</div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono-tabular">
              <span className="px-2 py-0.5 rounded bg-[#1E1714] text-[#FBF5EA]">M</span>
              <span className="px-2 py-0.5 rounded border border-[#C9B39B] text-[#1E1714]">L</span>
              <span className="px-2 py-0.5 rounded border border-[#C9B39B] text-[#1E1714]">XL</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-[#6B584E] border-t border-[#E2D2BE] pt-2">
          <span>New Winter Drop</span>
          <span className="text-[#1E1714] font-medium">Order via Cart / WhatsApp</span>
        </div>
      </div>
    );
  }

  if (sampleId === 'perfume') {
    return (
      <div
        className={`w-full ${heightClass} rounded-xl bg-[#241B17] border border-[#3C2F29] p-4 flex flex-col justify-between text-[#FBF5EA] select-none overflow-hidden`}
        dir="ltr"
      >
        <div className="flex items-center justify-between text-[11px] border-b border-[#3C2F29] pb-2">
          <span className="font-display font-semibold tracking-wide">NAFHA SCENTS</span>
          <span className="font-mono-tabular text-[#E5987E]">Eau de Parfum</span>
        </div>

        <div className="grid grid-cols-12 gap-3 items-center my-auto py-2">
          <div className="col-span-5 flex flex-col items-center justify-center h-24 rounded-lg bg-[#2E231E] border border-[#473831]">
            <div className="w-3 h-2.5 bg-[#D4856E] rounded-t-xs" />
            <div className="w-10 h-12 rounded-md bg-gradient-to-b from-[#D4856E]/75 to-[#B92708]/80 border border-[#E5987E]/50 flex items-center justify-center">
              <div className="w-5 h-6 bg-[#FBF5EA]/90 rounded-xs" />
            </div>
          </div>
          <div className="col-span-7 space-y-1.5">
            <div className="font-display text-sm font-semibold">Amber &amp; Cedar No. 04</div>
            <div className="text-[10px] text-[#D8C7BC]">
              Bergamot · Smoked Oud · Warm Vanilla
            </div>
            <div className="flex items-center gap-2 pt-1 font-mono-tabular text-[10px]">
              <span className="px-2 py-0.5 rounded bg-[#B92708] text-[#FBF5EA]">50 ml</span>
              <span className="px-2 py-0.5 rounded border border-[#5A483F] text-[#E6D9CE]">
                100 ml
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-[#C8B7AD] border-t border-[#3C2F29] pt-2">
          <span>24h Longevity</span>
          <span className="font-mono-tabular text-[#FBF5EA]">1,250 EGP</span>
        </div>
      </div>
    );
  }

  if (sampleId === 'shoes') {
    return (
      <div
        className={`w-full ${heightClass} rounded-xl bg-[#EFE4D4] border border-[#DFCEB9] p-4 flex flex-col justify-between select-none overflow-hidden`}
        dir="ltr"
      >
        <div className="flex items-center justify-between text-[11px] border-b border-[#DFCEB9] pb-2">
          <span className="font-display font-semibold text-[#1E1714]">KHATWA FOOTWEAR</span>
          <span className="font-mono-tabular text-[#6B584E]">EU 39–45</span>
        </div>

        <div className="my-auto py-2 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="w-24 h-20 rounded-lg bg-[#FAF4E9] border border-[#D9C5AE] flex items-center justify-center shrink-0">
              <svg className="w-14 h-10 text-[#B92708]" viewBox="0 0 64 40" fill="none">
                <path
                  d="M8 28H54C56 28 57 26 55 24L43 18L33 10L22 15L11 14C8 14 6 18 6 22V26C6 27 7 28 8 28Z"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinejoin="round"
                />
                <path d="M6 31H56" stroke="#1E1714" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="flex-1 space-y-1">
              <div className="text-xs font-semibold text-[#1E1714]">Nubuck Court Runner</div>
              <div className="text-[10px] text-[#6B584E]">Hand-stitched suede · Cushioned sole</div>
              <div className="font-mono-tabular text-xs font-semibold text-[#B92708]">1,850 EGP</div>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-1.5 font-mono-tabular text-[10px] text-center">
            {['40', '41', '42', '43', '44'].map((size, i) => (
              <div
                key={size}
                className={`py-1 rounded border ${
                  i === 2
                    ? 'bg-[#1E1714] text-[#FBF5EA] border-[#1E1714]'
                    : 'bg-[#FAF4E9] text-[#1E1714] border-[#D9C5AE]'
                }`}
              >
                {size}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-[#6B584E] border-t border-[#DFCEB9] pt-2">
          <span>Size Guide Included</span>
          <span className="text-[#1E1714] font-medium">Cash on Delivery</span>
        </div>
      </div>
    );
  }

  if (sampleId === 'accessories') {
    return (
      <div
        className={`w-full ${heightClass} rounded-xl bg-[#FAF3E8] border border-[#E5D7C5] p-4 flex flex-col justify-between select-none overflow-hidden`}
        dir="ltr"
      >
        <div className="flex items-center justify-between text-[11px] border-b border-[#E5D7C5] pb-2">
          <span className="font-display font-semibold text-[#1E1714]">HALA CRAFT</span>
          <span className="text-[#B92708] font-medium">925 Silver</span>
        </div>

        <div className="grid grid-cols-2 gap-3 my-auto py-2">
          <div className="rounded-lg bg-[#FFFDF9] border border-[#E5D7C5] p-2.5 space-y-1.5">
            <div className="h-12 rounded bg-[#F5E9DA] flex items-center justify-center">
              <div className="w-7 h-7 rounded-full border-4 border-[#B92708]" />
            </div>
            <div className="text-[11px] font-medium text-[#1E1714]">Signet Ring</div>
            <div className="font-mono-tabular text-[10px] text-[#6B584E]">480 EGP</div>
          </div>

          <div className="rounded-lg bg-[#FFFDF9] border border-[#E5D7C5] p-2.5 space-y-1.5">
            <div className="h-12 rounded bg-[#F5E9DA] flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border-2 border-[#1E1714] flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#D4856E]" />
              </div>
            </div>
            <div className="text-[11px] font-medium text-[#1E1714]">Pendant Chain</div>
            <div className="font-mono-tabular text-[10px] text-[#6B584E]">620 EGP</div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-[#6B584E] border-t border-[#E5D7C5] pt-2">
          <span>Rings · Bracelets · Watches</span>
          <span className="text-[#1E1714] font-medium">Gift Box Option</span>
        </div>
      </div>
    );
  }

  if (sampleId === 'cafe') {
    return (
      <div
        className={`w-full ${heightClass} rounded-xl bg-[#F5EBDC] border border-[#DFCEB9] p-4 flex flex-col justify-between select-none overflow-hidden`}
        dir="ltr"
      >
        <div className="flex items-center justify-between text-[11px] border-b border-[#DFCEB9] pb-2">
          <span className="font-display font-semibold text-[#1E1714]">BUN &amp; ROASTERY</span>
          <span className="font-mono-tabular text-[#B92708]">QR Menu</span>
        </div>

        <div className="my-auto py-2 space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-medium">
            <span className="px-2 py-0.5 rounded bg-[#B92708] text-[#FBF5EA]">Hot Coffee</span>
            <span className="px-2 py-0.5 rounded bg-[#FFFDF9] text-[#4A3B33] border border-[#DFCEB9]">
              Iced
            </span>
            <span className="px-2 py-0.5 rounded bg-[#FFFDF9] text-[#4A3B33] border border-[#DFCEB9]">
              Bakery
            </span>
          </div>

          <div className="space-y-1.5 text-[11px] pt-1">
            <div className="flex items-center justify-between py-1 border-b border-[#E4D5C2]">
              <span className="font-medium text-[#1E1714]">Spanish Latte</span>
              <span className="font-mono-tabular text-[#B92708]">95 EGP</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-[#E4D5C2]">
              <span className="font-medium text-[#1E1714]">V60 Single Origin</span>
              <span className="font-mono-tabular text-[#B92708]">110 EGP</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="font-medium text-[#1E1714]">Pistachio Croissant</span>
              <span className="font-mono-tabular text-[#B92708]">120 EGP</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-[#6B584E] border-t border-[#DFCEB9] pt-2">
          <span>Open 8 AM – 1 AM</span>
          <span className="text-[#1E1714] font-medium">Map Location · Order</span>
        </div>
      </div>
    );
  }

  // wedding
  return (
    <div
      className={`w-full ${heightClass} rounded-xl bg-[#FFFDF9] border border-[#E5D7C5] p-4 flex flex-col justify-between text-center select-none overflow-hidden`}
      dir="ltr"
    >
      <div className="text-[10px] font-mono-tabular text-[#B92708] tracking-wider">
        SAVE THE DATE · 18.06.2026
      </div>

      <div className="my-auto space-y-2 py-2">
        <div className="font-display text-xl sm:text-2xl font-semibold text-[#1E1714]">
          Omar &amp; Salma
        </div>
        <div className="text-[11px] text-[#6B584E]">
          We invite you to celebrate with us in Cairo
        </div>
        <div className="flex items-center justify-center gap-2 pt-1 font-mono-tabular text-[10px]">
          <div className="px-2.5 py-1 rounded bg-[#FBF5EA] border border-[#E5D7C5]">
            <div className="font-semibold text-[#1E1714]">24</div>
            <div className="text-[#6B584E]">Days</div>
          </div>
          <div className="px-2.5 py-1 rounded bg-[#FBF5EA] border border-[#E5D7C5]">
            <div className="font-semibold text-[#1E1714]">08</div>
            <div className="text-[#6B584E]">Hours</div>
          </div>
          <div className="px-2.5 py-1 rounded bg-[#FBF5EA] border border-[#E5D7C5]">
            <div className="font-semibold text-[#1E1714]">15</div>
            <div className="text-[#6B584E]">Mins</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] border-t border-[#EADFD0] pt-2 text-[#4A3B33]">
        <span>Venue Map Pin</span>
        <span className="text-[#B92708] font-medium">Confirm Attendance (RSVP)</span>
      </div>
    </div>
  );
};
