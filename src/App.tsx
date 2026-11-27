import React, { useEffect, useRef, useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Check, Globe, AlertCircle } from 'lucide-react';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import {
  Language,
  NicheId,
  ShowcaseSample,
  SIMPLE_STUDIO_COPY,
} from './data/studioData';
import { ProjectArtwork } from './components/ProjectArtwork';
import { CaseStudyModal } from './components/CaseStudyModal';
import { HiddenAdminDashboard } from './components/HiddenAdminDashboard';
import { db, handleFirestoreError, OperationType } from './firebase';

function isSecretRouteActive(): boolean {
  if (typeof window === 'undefined') return false;
  const hashMatch = window.location.hash === '#studio-desk';
  const params = new URLSearchParams(window.location.search);
  const queryMatch = params.get('panel') === 'ycraft-admin';
  return hashMatch || queryMatch;
}

export default function App() {
  const [lang, setLang] = useState<Language>('ar');
  const [activeFilter, setActiveFilter] = useState<NicheId>('all');
  const [selectedSample, setSelectedSample] = useState<ShowcaseSample | null>(null);
  const [showHiddenAdmin, setShowHiddenAdmin] = useState<boolean>(() =>
    isSecretRouteActive()
  );

  // Contact / Waiting Order form state
  const [name, setName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [selectedType, setSelectedType] = useState<string>('clothing');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Secret 5-tap logo counter
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<number | null>(null);

  const copy = SIMPLE_STUDIO_COPY[lang];
  const isRtl = lang === 'ar';

  useEffect(() => {
    const handleHashChange = () => {
      if (isSecretRouteActive()) {
        setShowHiddenAdmin(true);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.altKey) && e.shiftKey && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        setShowHiddenAdmin((prev) => !prev);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    tapCountRef.current += 1;
    if (tapTimerRef.current) {
      window.clearTimeout(tapTimerRef.current);
    }
    if (tapCountRef.current >= 5) {
      e.preventDefault();
      tapCountRef.current = 0;
      setShowHiddenAdmin(true);
      return;
    }
    tapTimerRef.current = window.setTimeout(() => {
      tapCountRef.current = 0;
    }, 2500);
  };

  const handleCloseAdmin = () => {
    setShowHiddenAdmin(false);
    if (window.location.hash === '#studio-desk') {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  if (showHiddenAdmin) {
    return <HiddenAdminDashboard onClose={handleCloseAdmin} lang={lang} />;
  }

  const visibleSamples =
    activeFilter === 'all' || activeFilter === 'custom'
      ? copy.samples
      : copy.samples.filter((sample) => sample.id === activeFilter);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNicheClick = (nicheId: Exclude<NicheId, 'all'>) => {
    setSelectedType(nicheId);
    if (nicheId === 'custom') {
      scrollToSection('contact');
      return;
    }
    setActiveFilter(nicheId);
    scrollToSection('samples');
  };

  const handleRequestSimilar = (sample: ShowcaseSample) => {
    setSelectedSample(null);
    setSelectedType(sample.id);
    setSubmitted(false);
    scrollToSection('contact');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim().slice(0, 120);
    const cleanContact = contactInfo.trim().slice(0, 160);
    const cleanNotes = notes.trim().slice(0, 1000);

    if (cleanName.length < 1 || cleanContact.length < 3) {
      setFormError(copy.contactSection.errorRequired);
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    const orderId = `ord_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const path = `waiting_orders/${orderId}`;

    try {
      await setDoc(doc(db, 'waiting_orders', orderId), {
        name: cleanName,
        contactInfo: cleanContact,
        websiteType: selectedType,
        notes: cleanNotes,
        status: 'waiting',
        lang,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch (error) {
      setIsSubmitting(false);
      handleFirestoreError(error, OperationType.CREATE, path);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName('');
    setContactInfo('');
    setNotes('');
    setFormError(null);
    setSubmitted(false);
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      lang={lang}
      className="min-h-screen bg-[#FBF5EA] text-[#1E1714]"
    >
      {/* Top Bar Contract: 3 clean zones (zero admin links visible to public) */}
      <header className="sticky top-0 z-40 bg-[#FBF5EA]/90 backdrop-blur-md border-b border-[#E5D7C5]">
        <div className="max-w-[1160px] mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-8">
          <a
            href="#top"
            onClick={handleLogoClick}
            className="font-display text-xl font-bold tracking-tight text-[#B92708] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B92708]"
          >
            Y-CRAFT
          </a>

          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-[#4A3B33]"
          >
            <a
              href="#niches"
              className="hover:text-[#B92708] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {copy.nav.niches}
            </a>
            <a
              href="#samples"
              className="hover:text-[#B92708] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {copy.nav.samples}
            </a>
            <a
              href="#contact"
              className="hover:text-[#B92708] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {copy.nav.contact}
            </a>
          </nav>

          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => scrollToSection('contact')}
              className="px-4 py-2 text-xs sm:text-sm font-medium rounded-lg bg-[#B92708] hover:bg-[#991F05] text-[#FBF5EA] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B92708]"
            >
              {copy.nav.cta}
            </button>
          </div>
        </div>
      </header>

      <main id="top">
        {/* Hero Section with Logo as Soft Background */}
        <section className="relative overflow-hidden border-b border-[#E5D7C5]/60">
          {/* Background Logo Layer */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
            aria-hidden="true"
          >
            <img
              src="/assets/aistudio/Beige_and_Orange_Minimal_Design_Studio_Logo_20261127_151017_0000_d43e285c.png"
              alt=""
              referrerPolicy="no-referrer"
              className="w-[460px] sm:w-[580px] md:w-[660px] max-w-[92vw] h-auto object-contain opacity-[0.22] mix-blend-multiply"
            />
            <div className="absolute inset-0 bg-radial from-[#FBF5EA]/20 via-[#FBF5EA]/45 to-[#FBF5EA]/85" />
          </div>

          <div className="relative z-10 max-w-[1160px] mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-16 sm:pb-24 flex flex-col items-center text-center">
            <div className="w-full max-w-3xl space-y-6">
              <div className="flex items-center justify-center gap-4">
                <span className="text-xs sm:text-sm font-medium text-[#B92708]">
                  {copy.hero.kicker}
                </span>
                <span aria-hidden="true" className="text-[#C9B39B]">·</span>
                <button
                  type="button"
                  onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#4A3B33] hover:text-[#B92708] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B92708]"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{copy.hero.langSwitchLabel}</span>
                </button>
              </div>

              <h1
                className="font-display font-semibold tracking-tight text-[#1E1714] leading-[1.15] text-balance mx-auto"
                style={{ fontSize: 'clamp(2.2rem, 4.4vw, 3.75rem)' }}
              >
                {copy.hero.headline}
              </h1>

              <p className="text-base sm:text-lg text-[#3A2E28] leading-relaxed max-w-2xl mx-auto">
                {copy.hero.subheadline}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
                <button
                  type="button"
                  onClick={() => scrollToSection('contact')}
                  className="min-h-[44px] inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#B92708] hover:bg-[#991F05] text-[#FBF5EA] text-sm font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B92708]"
                >
                  <span>{copy.hero.primaryCta}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection('samples')}
                  className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-[#DECBB5] bg-[#FFFDF9]/80 hover:border-[#B92708] text-sm font-medium text-[#1E1714] hover:text-[#B92708] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B92708]"
                >
                  <span>{copy.hero.secondaryCta}</span>
                  <ArrowDownLeft className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-[#6B584E] pt-2">{copy.hero.logoCaption}</p>
            </div>
          </div>
        </section>

        {/* Section 2: Niches / Categories We Build */}
        <section
          id="niches"
          className="border-t border-[#E5D7C5] bg-[#F5EBDC]/50 py-14 sm:py-20"
        >
          <div className="max-w-[1160px] mx-auto px-5 sm:px-8 space-y-10">
            <div className="max-w-2xl space-y-2">
              <p className="text-xs font-medium text-[#B92708]">
                {copy.nichesSection.kicker}
              </p>
              <h2 className="font-display text-2xl sm:text-4xl font-semibold tracking-tight text-[#1E1714] text-balance">
                {copy.nichesSection.title}
              </h2>
              <p className="text-sm sm:text-base text-[#6B584E] leading-relaxed">
                {copy.nichesSection.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">
              {copy.niches.map((niche) => (
                <button
                  key={niche.id}
                  type="button"
                  onClick={() => handleNicheClick(niche.id)}
                  className="group text-start py-5 border-t border-[#DECBB5] hover:border-[#B92708] transition-colors space-y-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B92708]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-baseline gap-2.5">
                      <span className="font-mono-tabular text-sm font-medium text-[#B92708]">
                        {niche.number}
                      </span>
                      <h3 className="font-display text-lg font-semibold text-[#1E1714] group-hover:text-[#B92708] transition-colors">
                        {niche.title}
                      </h3>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-[#8E7A6E] group-hover:text-[#B92708] shrink-0 transition-colors" />
                  </div>
                  <p className="text-sm text-[#4A3B33] leading-relaxed">{niche.description}</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Live Simple Website Examples */}
        <section id="samples" className="max-w-[1160px] mx-auto px-5 sm:px-8 py-14 sm:py-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#E5D7C5]">
            <div className="space-y-2 max-w-xl">
              <p className="text-xs font-medium text-[#B92708]">
                {copy.samplesSection.kicker}
              </p>
              <h2 className="font-display text-2xl sm:text-4xl font-semibold tracking-tight text-[#1E1714] text-balance">
                {copy.samplesSection.title}
              </h2>
              <p className="text-sm sm:text-base text-[#6B584E]">
                {copy.samplesSection.subtitle}
              </p>
            </div>

            <div
              className="flex flex-wrap items-center gap-1 p-1 rounded-lg bg-[#EFE4D4] border border-[#E5D7C5] self-start md:self-auto"
              role="group"
              aria-label="Filter website examples"
            >
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`min-h-[36px] px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  activeFilter === 'all'
                    ? 'bg-[#FFFDF9] text-[#1E1714] shadow-xs'
                    : 'text-[#6B584E] hover:text-[#1E1714]'
                }`}
              >
                {copy.samplesSection.allFilter}
              </button>
              {copy.samples.map((sample) => {
                const active = activeFilter === sample.id;
                return (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => setActiveFilter(sample.id)}
                    className={`min-h-[36px] px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      active
                        ? 'bg-[#FFFDF9] text-[#1E1714] shadow-xs'
                        : 'text-[#6B584E] hover:text-[#1E1714]'
                    }`}
                  >
                    {sample.nicheTitle}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleSamples.map((sample) => (
              <article
                key={sample.id}
                className="group rounded-2xl bg-[#FFFDF9] border border-[#E5D7C5] hover:border-[#B92708]/60 transition-colors p-5 flex flex-col justify-between gap-4"
              >
                <div className="space-y-3.5">
                  <button
                    type="button"
                    onClick={() => setSelectedSample(sample)}
                    className="w-full block text-start rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B92708]"
                    aria-label={`${copy.samplesSection.previewButton}: ${sample.brandName}`}
                  >
                    <ProjectArtwork sampleId={sample.id} />
                  </button>

                  <div className="flex items-center gap-2 text-xs text-[#6B584E]">
                    <span className="font-medium text-[#B92708]">{sample.nicheTitle}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-medium text-[#1E1714]">{sample.brandName}</span>
                  </div>

                  <p className="text-sm text-[#4A3B33] leading-relaxed">{sample.tagline}</p>
                </div>

                <div className="pt-3 border-t border-[#EADFD0] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSelectedSample(sample)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1E1714] hover:text-[#B92708] transition-colors whitespace-nowrap"
                  >
                    <span>{copy.samplesSection.previewButton}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRequestSimilar(sample)}
                    className="text-xs font-medium text-[#B92708] hover:underline whitespace-nowrap"
                  >
                    {copy.samplesSection.requestSimilar}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Section 4: Simple Order Form (Writes directly to private Firestore waiting_orders) */}
        <section
          id="contact"
          className="border-t border-[#E5D7C5] bg-[#F5EBDC]/55 py-14 sm:py-20"
        >
          <div className="max-w-[1160px] mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-3">
              <p className="text-xs font-medium text-[#B92708]">
                {copy.contactSection.kicker}
              </p>
              <h2 className="font-display text-2xl sm:text-4xl font-semibold tracking-tight text-[#1E1714] text-balance">
                {copy.contactSection.title}
              </h2>
              <p className="text-sm sm:text-base text-[#4A3B33] leading-relaxed">
                {copy.contactSection.subtitle}
              </p>
            </div>

            <div className="lg:col-span-7 rounded-2xl bg-[#FFFDF9] border border-[#E5D7C5] p-6 sm:p-8">
              {submitted ? (
                <div className="py-6 space-y-4">
                  <div className="w-11 h-11 rounded-xl bg-[#F5E9DA] border border-[#B92708]/30 flex items-center justify-center text-[#B92708]">
                    <Check className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-[#1E1714]">
                    {copy.contactSection.successTitle}
                  </h3>
                  <p className="text-sm text-[#4A3B33] leading-relaxed">
                    {copy.contactSection.successBody}
                  </p>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="min-h-[44px] px-4 py-2 rounded-lg border border-[#DECBB5] text-sm font-medium text-[#1E1714] hover:border-[#B92708] transition-colors"
                  >
                    {copy.contactSection.resetButton}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="simple-name"
                        className="block text-xs font-medium text-[#1E1714]"
                      >
                        {copy.contactSection.nameLabel}
                      </label>
                      <input
                        id="simple-name"
                        type="text"
                        maxLength={120}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={copy.contactSection.namePlaceholder}
                        className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-[#FBF5EA] border border-[#DFCEB9] text-sm text-[#1E1714] placeholder:text-[#8E7A6E] focus:outline-none focus:border-[#B92708]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="simple-contact"
                        className="block text-xs font-medium text-[#1E1714]"
                      >
                        {copy.contactSection.contactLabel}
                      </label>
                      <input
                        id="simple-contact"
                        type="text"
                        maxLength={160}
                        value={contactInfo}
                        onChange={(e) => setContactInfo(e.target.value)}
                        placeholder={copy.contactSection.contactPlaceholder}
                        className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-[#FBF5EA] border border-[#DFCEB9] text-sm text-[#1E1714] placeholder:text-[#8E7A6E] focus:outline-none focus:border-[#B92708]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="simple-type"
                      className="block text-xs font-medium text-[#1E1714]"
                    >
                      {copy.contactSection.typeLabel}
                    </label>
                    <select
                      id="simple-type"
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-[#FBF5EA] border border-[#DFCEB9] text-sm text-[#1E1714] focus:outline-none focus:border-[#B92708]"
                    >
                      {copy.niches.map((niche) => (
                        <option key={niche.id} value={niche.id}>
                          {niche.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="simple-notes"
                      className="block text-xs font-medium text-[#1E1714]"
                    >
                      {copy.contactSection.notesLabel}
                    </label>
                    <textarea
                      id="simple-notes"
                      rows={3}
                      maxLength={1000}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={copy.contactSection.notesPlaceholder}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#FBF5EA] border border-[#DFCEB9] text-sm text-[#1E1714] placeholder:text-[#8E7A6E] focus:outline-none focus:border-[#B92708] resize-y"
                    />
                  </div>

                  {formError && (
                    <div
                      role="alert"
                      className="flex items-center gap-2 text-xs font-medium text-[#B92708] bg-[#F5E9DA] border border-[#B92708]/30 rounded-lg px-3.5 py-2.5"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="min-h-[44px] w-full sm:w-auto px-6 py-3 rounded-lg bg-[#B92708] hover:bg-[#991F05] disabled:opacity-60 text-[#FBF5EA] text-sm font-medium transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B92708]"
                  >
                    {isSubmitting
                      ? lang === 'ar'
                        ? 'جاري الإرسال...'
                        : 'Sending...'
                      : copy.contactSection.submitButton}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-[#E5D7C5] bg-[#FBF5EA] py-9">
        <div className="max-w-[1160px] mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="font-display text-lg font-bold text-[#B92708]">Y-CRAFT</div>
            <p className="text-xs text-[#6B584E]">{copy.footer.tagline}</p>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs text-[#4A3B33]">
            <a href="#niches" className="hover:text-[#B92708] transition-colors whitespace-nowrap">
              {copy.nav.niches}
            </a>
            <a href="#samples" className="hover:text-[#B92708] transition-colors whitespace-nowrap">
              {copy.nav.samples}
            </a>
            <a href="#contact" className="hover:text-[#B92708] transition-colors whitespace-nowrap">
              {copy.nav.contact}
            </a>
            <button
              type="button"
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="inline-flex items-center gap-1.5 font-medium text-[#B92708] hover:underline whitespace-nowrap"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{copy.hero.langSwitchLabel}</span>
            </button>
          </div>
        </div>

        <div className="max-w-[1160px] mx-auto px-5 sm:px-8 mt-6 pt-5 border-t border-[#EADFD0] text-xs text-[#6B584E]">
          {copy.footer.copyright}
        </div>
      </footer>

      <CaseStudyModal
        sample={selectedSample}
        copy={copy.samplesSection}
        onClose={() => setSelectedSample(null)}
        onRequestSimilar={handleRequestSimilar}
      />
    </div>
  );
}
