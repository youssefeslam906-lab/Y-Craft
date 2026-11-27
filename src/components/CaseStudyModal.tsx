import React, { useEffect, useState } from 'react';
import { X, ArrowUpRight, Check, Lock } from 'lucide-react';
import { ShowcaseSample, SimpleStudioCopy } from '../data/studioData';
import { ProjectArtwork } from './ProjectArtwork';

interface CaseStudyModalProps {
  sample: ShowcaseSample | null;
  copy: SimpleStudioCopy['samplesSection'];
  onClose: () => void;
  onRequestSimilar: (sample: ShowcaseSample) => void;
}

const STUDIO_LOGO_URL =
  '/assets/aistudio/Beige_and_Orange_Minimal_Design_Studio_Logo_20261127_151017_0000_d43e285c.png';

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({
  sample,
  copy,
  onClose,
  onRequestSimilar,
}) => {
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    if (!sample) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sample, onClose]);

  if (!sample) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E1714]/65 backdrop-blur-xs p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sample-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl bg-[#FBF5EA] text-[#1E1714] border border-[#DFCEB9] shadow-2xl p-5 sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E5D7C5]">
          <div className="space-y-1">
            <div className="text-xs font-medium text-[#B92708]">{sample.nicheTitle}</div>
            <h3
              id="sample-modal-title"
              className="font-display text-2xl font-semibold text-[#1E1714]"
            >
              {sample.brandName}
            </h3>
            <p className="text-sm text-[#4A3B33]">{sample.tagline}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={copy.closeLabel}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg border border-[#DECBB5] text-[#1E1714] hover:bg-[#EFE4D4] transition-colors shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B92708]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Outer Website Look + Studio Brand Logo Together */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Outer Browser Frame (شكل الويب من الخارج) */}
          <div
            className="lg:col-span-8 rounded-xl border border-[#D4C2AC] bg-[#FFFDF9] overflow-hidden shadow-sm flex flex-col"
            dir="ltr"
          >
            {/* Outer Browser Chrome */}
            <div className="bg-[#EFE4D4] border-b border-[#DFCEB9] px-3.5 py-2.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C97B63]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#DFB48C]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#B9C4A7]" />
              </div>

              <div className="flex-1 max-w-sm mx-auto bg-[#FFFDF9] border border-[#DECBB5] rounded-md px-3 py-1 flex items-center justify-center gap-1.5 text-[11px] font-mono-tabular text-[#4A3B33]">
                <Lock className="w-3 h-3 text-[#B92708] shrink-0" />
                <span className="truncate">https://{sample.urlSlug}</span>
              </div>

              <div className="text-[10px] font-mono-tabular text-[#6B584E] shrink-0">
                Live View
              </div>
            </div>

            {/* Outer Website Header + Content Preview */}
            <div className="p-4 bg-[#FAF3E8] space-y-3 flex-1 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-[#E5D7C5] pb-2.5 text-[11px]">
                <div className="flex items-center gap-2">
                  {!logoError && (
                    <img
                      src={STUDIO_LOGO_URL}
                      alt="Y-CRAFT Logo"
                      referrerPolicy="no-referrer"
                      onError={() => setLogoError(true)}
                      className="w-7 h-7 rounded object-contain bg-[#FBF4E8] border border-[#E2D2BE]"
                    />
                  )}
                  <span className="font-display font-bold text-[#1E1714]">{sample.brandName}</span>
                </div>
                <div className="flex items-center gap-3 text-[#6B584E]">
                  <span>Home</span>
                  <span>Collection</span>
                  <span className="px-2 py-0.5 rounded bg-[#B92708] text-[#FBF5EA] font-medium">
                    Order Now
                  </span>
                </div>
              </div>

              <ProjectArtwork sampleId={sample.id} expanded />

              <div className="flex items-center justify-between text-[10px] text-[#6B584E] border-t border-[#E5D7C5] pt-2">
                <span>Desktop &amp; Mobile Responsive</span>
                <span>Crafted by Y-CRAFT Studio</span>
              </div>
            </div>
          </div>

          {/* Side Frame Showing the Exact Uploaded Studio Logo Alongside */}
          <div className="lg:col-span-4 rounded-xl border border-[#DFCEB9] bg-[#FBF4E8] p-4 flex flex-col items-center justify-between text-center gap-3">
            <div className="w-full text-[11px] font-mono-tabular text-[#6B584E] border-b border-[#EADFD0] pb-2">
              Y-CRAFT · Studio Identity
            </div>

            <div className="flex-1 flex items-center justify-center py-2">
              {!logoError ? (
                <img
                  src={STUDIO_LOGO_URL}
                  alt="Y-CRAFT Web Design Studio Logo"
                  referrerPolicy="no-referrer"
                  onError={() => setLogoError(true)}
                  className="w-full max-w-[210px] h-auto object-contain"
                />
              ) : (
                <div className="font-display text-2xl font-bold text-[#B92708]">Y-CRAFT</div>
              )}
            </div>

            <div className="w-full text-xs text-[#4A3B33] border-t border-[#EADFD0] pt-2.5 leading-relaxed">
              {sample.nicheTitle} · {sample.urlSlug}
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <h4 className="text-sm font-semibold text-[#1E1714]">{copy.includedLabel}</h4>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {sample.highlights.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-[#3A2E28] bg-[#FFFDF9] border border-[#E5D7C5] rounded-xl p-3"
              >
                <Check className="w-4 h-4 text-[#B92708] shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 pt-5 border-t border-[#E5D7C5] flex flex-wrap items-center justify-between gap-4">
          <span className="font-mono-tabular text-xs text-[#6B584E]">{sample.urlSlug}</span>
          <button
            type="button"
            onClick={() => onRequestSimilar(sample)}
            className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#B92708] hover:bg-[#991F05] text-[#FBF5EA] text-sm font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B92708]"
          >
            <span>{copy.requestSimilar}</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
