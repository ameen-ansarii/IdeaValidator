"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowRight, AlertTriangle, TrendingUp, Target, ShieldAlert, Layers, Sparkles, AlertOctagon, DollarSign, Users, Download, RefreshCw, Map, Lock, Share2, Check, BarChart3, Zap, Flame, Palette, Search, ExternalLink, Minus, TrendingDown, Globe, Building2, CreditCard, Crown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import Link from "next/link";
import { validateIdea, pivotIdea, generateRoadmap, analyzeCompetitors, calculateMarketSize, roastIdea, generateBrandVibe, recommendTechStack } from "./actions";
import { ValidationReport, CompetitiveAnalysis as CompetitiveAnalysisType, MarketSize, TechStack, PivotStrategy } from "./types";

import MaskedText from "./components/MaskedText";
import AnalysisTerminal from "./components/AnalysisTerminal";
import ExampleIdeas from "./components/ExampleIdeas";
import CompetitiveAnalysis from "./components/CompetitiveAnalysis";
import MarketSizeCalculator from "./components/MarketSizeCalculator";
import OnboardingTutorial from "./components/OnboardingTutorial";
import IdeaSlotMachine from "./components/IdeaSlotMachine";
import TrendTicker from "./components/TrendTicker";
import RoastCard from "./components/RoastCard";
import BrandVibe from "./components/BrandVibe";
import TechStackDisplay from "./components/TechStackDisplay";
import CircularGauge from "./components/CircularGauge";
import { generatePDF } from "./utils/generatePDF";
import UserAuth from "./components/UserAuth";
import LockedFeature, { LockedBadge } from "./components/LockedFeature";
import { useSubscription } from "./context/SubscriptionContext";
import PricingModal from "./components/PricingModal";
import { useTheme } from "./context/ThemeContext";
import BackgroundDots from "./components/BackgroundDots";

function HomeContent() {
  const { theme } = useTheme();
  const [idea, setIdea] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<ValidationReport | null>(null);
  const [pivot, setPivot] = useState<PivotStrategy | null>(null);
  const [isPivoting, setIsPivoting] = useState(false);
  const [roadmap, setRoadmap] = useState<any[] | null>(null);
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [competitiveAnalysis, setCompetitiveAnalysis] = useState<CompetitiveAnalysisType | null>(null);
  const [isAnalyzingCompetitors, setIsAnalyzingCompetitors] = useState(false);
  const [marketSize, setMarketSize] = useState<MarketSize | null>(null);
  const [isCalculatingMarket, setIsCalculatingMarket] = useState(false);
  const [isRoastMode, setIsRoastMode] = useState(false);
  const [brandVibeResult, setBrandVibeResult] = useState<{ colors: string[], fontPair: string, slogan: string, designStyle: string } | null>(null);
  const [isGeneratingVibe, setIsGeneratingVibe] = useState(false);
  const [techStack, setTechStack] = useState<TechStack | null>(null);
  const [isRecommendingStack, setIsRecommendingStack] = useState(false);

  // Subscription tier for feature gating
  const { canAccess, isPro, isEnterprise, tier } = useSubscription();

  const searchParams = useSearchParams();
  const router = useRouter();
  const historyId = searchParams.get('historyId');


  // ... existing useEffects ...

  const handleShare = async () => {
    // ... existing share logic ...
    if (!report) return;
    try {
      const shareData = { idea, report, timestamp: Date.now() };
      const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(shareData))));
      const url = `${window.location.origin}/share?data=${encoded}`;
      if (navigator.share) {
        await navigator.share({
          title: 'Idea Validator Report',
          text: `Check out this validation report for: ${idea.substring(0, 50)}...`,
          url: url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch (err) {
      console.error("Share failed", err);
    }
  };

  const handleAnalyze = async () => {
    if (!idea.trim()) return;

    setIsAnalyzing(true);
    setReport(null);
    setPivot(null);
    setRoadmap(null);
    setCompetitiveAnalysis(null);
    setMarketSize(null);
    setBrandVibeResult(null);

    try {
      // Minimum 5s wait for the "Theater" effect, slightly faster
      const [result] = await Promise.all([
        validateIdea(idea, isRoastMode ? 'roast' : 'default'),
        new Promise(resolve => setTimeout(resolve, 6000))
      ]);

      setReport(result);
    } catch (error) {
      console.error("Validation failed", error);
      alert("Analysis failed. Please check your API usage or try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateBrandVibe = async () => {
    if (!idea) return;
    setIsGeneratingVibe(true);
    try {
      const vibe = await generateBrandVibe(idea);
      setBrandVibeResult(vibe);
    } catch (e) {
      console.error(e);
      alert("Failed to generate brand vibe.");
    } finally {
      setIsGeneratingVibe(false);
    }
  };

  const handleRecommendTechStack = async () => {
    if (!idea) return;
    setIsRecommendingStack(true);
    try {
      const stack = await recommendTechStack(idea);
      setTechStack(stack);
    } catch (e) {
      console.error(e);
      alert("Failed to recommend tech stack.");
    } finally {
      setIsRecommendingStack(false);
    }
  };

  const handlePivot = async () => {
    if (!idea) return;
    setIsPivoting(true);
    try {
      const newIdea = await pivotIdea(idea);
      setPivot(newIdea);
    } catch (e) {
      console.error(e);
    } finally {
      setIsPivoting(false);
    }
  };

  const handleGenerateRoadmap = async () => {
    if (!idea) return;
    setIsGeneratingRoadmap(true);
    try {
      const plan = await generateRoadmap(idea);
      setRoadmap(plan);
      setShowRoadmapModal(true);
      // Smooth scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      console.error(e);
      alert("Could not generate roadmap. Please try again.");
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  const handleAnalyzeCompetitors = async () => {
    if (!idea) return;
    setIsAnalyzingCompetitors(true);
    try {
      const analysis = await analyzeCompetitors(idea);
      setCompetitiveAnalysis(analysis);
    } catch (e) {
      console.error(e);
      alert("Could not analyze competitors. Please try again.");
    } finally {
      setIsAnalyzingCompetitors(false);
    }
  };

  const handleCalculateMarketSize = async () => {
    if (!idea) return;
    setIsCalculatingMarket(true);
    try {
      const size = await calculateMarketSize(idea);
      setMarketSize(size);
    } catch (e) {
      console.error(e);
      alert("Could not calculate market size. Please try again.");
    } finally {
      setIsCalculatingMarket(false);
    }
  };

  const handleSelectExampleIdea = (exampleIdea: string) => {
    setIdea(exampleIdea);
    // Auto-scroll to input
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <BackgroundDots>
      <main className="min-h-screen flex flex-col items-center justify-start p-4 md:p-6 pt-32 md:pt-40 relative pb-24 font-sans selection:bg-blue-500/30">

        {/* NavBar and ThemeToggle are now in layout.tsx */}

        <div className="bg-aurora" />

      <div className="max-w-6xl w-full z-10 transition-all duration-700 ease-[0.16,1,0.3,1] flex flex-col items-center">

        {/* Header - Linear Style */}
        {/* Header - Linear Style */}
        {!report && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 md:mb-10 space-y-4 relative w-full max-w-4xl mx-auto"
          >
            {/* Minimal Pill */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--card-border)] bg-[var(--card-highlight)] backdrop-blur-md mb-4 hover:bg-[var(--card-border)] transition-colors cursor-default"
            >
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400">
                <Zap className="w-3 h-3 fill-indigo-400/50" />
              </div>
              <span className="text-xs font-semibold text-[var(--foreground)] tracking-wide uppercase">
                Idea Intelligence <span className="text-[var(--text-secondary)] mx-1">//</span> v2.4
              </span>
            </motion.div>

            <div className="relative z-10 space-y-3">
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-semibold tracking-tighter text-[var(--foreground)] leading-[1.1]">
                <MaskedText text="Validate" delay={0.1} />
                <span className="text-[var(--text-secondary)] ml-2 md:ml-3 block md:inline">Instantly</span>
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-base sm:text-lg text-[var(--text-secondary)] max-w-xl mx-auto font-normal leading-relaxed px-4"
              >
                Data-driven feedback on your startup idea.{" "}
                <span className="text-[var(--foreground)] block md:inline">No sugar coating. Just truth.</span>
              </motion.p>
            </div>
          </motion.div>
        )}

        {/* Input Section */}
        <AnimatePresence mode="wait">
          {!report && !isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.5, ease: "circOut" }}
              className="max-w-2xl mx-auto w-full"
            >
              <div className="macos-card p-1.5 rounded-2xl relative overflow-visible">
                <div className={clsx(
                  "rounded-[10px] p-4 md:p-6 border transition-colors duration-500 relative",
                  isRoastMode
                    ? "bg-red-50 dark:bg-[#050505] border-red-200 dark:border-red-500/20"
                    : "bg-[var(--card-bg)] border-[var(--card-border)]"
                )}>
                  {isRoastMode && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent opacity-50" />
                  )}

                  <textarea
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder={isRoastMode ? "Give me your worst idea... I dare you." : "Describe your startup idea..."}
                    className={clsx(
                      "w-full h-16 md:h-24 bg-transparent border-none text-base md:text-xl resize-none focus:ring-0 focus:outline-none font-medium leading-relaxed tracking-tight transition-colors",
                      isRoastMode
                        ? "text-red-900 dark:text-red-50 placeholder-red-800/40 dark:placeholder-red-200/30"
                        : "text-[var(--foreground)] placeholder-[var(--text-secondary)]"
                    )}
                  />

                  <div className="flex flex-row justify-between items-center mt-3 pt-3 md:mt-4 md:pt-4 border-t border-[var(--card-border)] gap-4">
                    <div className="flex items-center gap-3 text-xs font-medium text-[var(--text-secondary)] w-auto justify-start">
                      {/* Roast Mode Toggle - Enterprise Only */}
                      {canAccess("enterprise") ? (
                        <div
                          onClick={() => setIsRoastMode(!isRoastMode)}
                          className="flex items-center gap-3 cursor-pointer group select-none"
                        >
                          <div className={clsx(
                            "w-10 h-5 rounded-full p-0.5 transition-colors duration-300 relative border",
                            isRoastMode
                              ? "bg-red-100 dark:bg-red-900/20 border-red-300 dark:border-red-500/50"
                              : "bg-[var(--card-highlight)] border-[var(--card-border)] group-hover:border-[var(--text-secondary)]"
                          )}>
                            <motion.div
                              layout
                              transition={{ type: "spring", stiffness: 700, damping: 30 }}
                              className={clsx(
                                "w-4 h-4 rounded-full shadow-sm",
                                isRoastMode ? "bg-red-500" : "bg-[var(--text-secondary)]"
                              )}
                              animate={{ x: isRoastMode ? 20 : 0 }}
                            />
                          </div>
                          <span className={clsx(
                            "transition-colors duration-300",
                            isRoastMode ? "text-red-600 dark:text-red-400 font-semibold" : "text-[var(--text-secondary)] group-hover:text-[var(--foreground)]"
                          )}>
                            {isRoastMode ? "🔥 Roast Mode Active" : "Safe Mode"}
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowPricingModal(true)}
                          className="flex items-center gap-3 cursor-pointer group select-none"
                        >
                          <div className="w-10 h-5 rounded-full p-0.5 transition-colors duration-300 relative border bg-purple-500/10 border-purple-500/30">
                            <div className="w-4 h-4 rounded-full shadow-sm bg-purple-400/50 flex items-center justify-center">
                              <Lock className="w-2 h-2 text-purple-300" />
                            </div>
                          </div>
                          <span className="text-purple-400 group-hover:text-purple-300 transition-colors flex items-center gap-1.5">
                            🔥 Roast Mode
                            <LockedBadge tier="enterprise" />
                          </span>
                        </button>
                      )}
                    </div>

                    <button
                      onClick={handleAnalyze}
                      disabled={!idea.trim() || isAnalyzing}
                      className={clsx(
                        "liquid-button px-4 py-2.5 md:px-6 md:py-3 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300",
                        isRoastMode
                          ? "bg-red-500 hover:bg-red-600 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] text-white border-red-500/50"
                          : "bg-[var(--foreground)] text-[var(--background)] hover:bg-[var(--text-secondary)]"
                      )}
                    >
                      {isAnalyzing ? (
                        <>
                          <span>{isRoastMode ? "Roasting..." : "Analyzing..."}</span>
                          <Flame className={clsx("w-4 h-4", isRoastMode ? "animate-pulse" : "hidden")} />
                          {!isRoastMode && <div className="w-4 h-4 border-2 border-[var(--background)]/30 border-t-[var(--background)] rounded-full animate-spin" />}
                        </>
                      ) : isRoastMode ? (
                        <>
                          <span>Roast My Idea</span>
                          <Flame className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          <span>Validate Idea</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Terminal Loading State */}
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/50 backdrop-blur-md"
          >
            <AnalysisTerminal isRoastMode={isRoastMode} />
          </motion.div>
        )}

        {/* Results - Linear Grid */}
        {report && !isAnalyzing && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 grid-rows-[auto] gap-4 pb-20 max-w-[1400px] mx-auto"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  duration: 0.6
                }
              }
            }}
            initial="hidden"
            animate="visible"
          >
            {/* Top Actions Header */}
            <motion.div
              className="md:col-span-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 mt-8 border-b border-[var(--card-border)] pb-6"
              variants={{
                hidden: { opacity: 0, y: -20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <div>
                <h2 className="text-3xl font-semibold text-[var(--foreground)] tracking-tight">Analysis Report</h2>
                <p className="text-[var(--text-secondary)] text-sm mt-1">Generated {new Date().toLocaleDateString()}</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleShare}
                  className="liquid-button secondary px-4 py-2 text-sm flex items-center gap-2"
                >
                  {isCopied ? <Check className="w-3 h-3 text-green-400" /> : <Share2 className="w-3 h-3" />}
                  {isCopied ? "Copied" : "Share"}
                </button>

                <button
                  onClick={() => generatePDF(report, idea)}
                  className="liquid-button secondary px-4 py-2 text-sm flex items-center gap-2"
                >
                  <Download className="w-3 h-3" />
                  PDF
                </button>

                <button
                  onClick={() => setReport(null)}
                  className="liquid-button px-4 py-2 text-sm flex items-center gap-2"
                >
                  <Sparkles className="w-3 h-3" />
                  New Analysis
                </button>
              </div>
            </motion.div>

            {/* ROAST MODE CARDS */}
            {report.roast && (
              <>
                {/* 1. Sarcastic Verdict (Full Width) */}
                <motion.div
                  className="col-span-1 sm:col-span-2 md:col-span-4 macos-card p-6 md:p-8 bg-gradient-to-br from-red-50 via-orange-50 to-white dark:from-[#2a0505] dark:via-[#1a0505] dark:to-black border-red-200 dark:border-red-500/50 relative overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.1)] dark:shadow-[0_0_50px_rgba(220,38,38,0.2)]"
                  variants={{
                    hidden: { opacity: 0, scale: 0.95 },
                    visible: { opacity: 1, scale: 1 }
                  }}
                >
                  {/* Animated Fire Effect (CSS Only approximation) */}
                  <div className="absolute top-0 right-0 p-4 opacity-50 mix-blend-screen animate-pulse">
                    <Flame className="w-24 h-24 text-red-600 blur-xl" />
                  </div>
                  <div className="absolute -bottom-10 -left-10 p-4 opacity-30 mix-blend-screen">
                    <Flame className="w-48 h-48 text-orange-600 blur-2xl" />
                  </div>

                  <h3 className="text-sm font-bold uppercase tracking-widest text-red-600 dark:text-red-500 mb-2 flex items-center gap-2">
                    <Flame className="w-4 h-4" /> The Reality Check
                  </h3>
                  <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 dark:from-red-500 dark:via-orange-500 dark:to-yellow-500 tracking-tight mb-6 mt-2 leading-[1.2]">
                    {report.roast.sarcasticVerdict}
                  </h2>
                  <div className="p-4 bg-red-100/50 dark:bg-red-950/30 border-l-4 border-red-500 rounded-r-lg backdrop-blur-sm">
                    <p className="text-lg text-red-900 dark:text-red-100 italic font-medium leading-relaxed">
                      "{report.roast.burn}"
                    </p>
                  </div>
                </motion.div>

                {/* 2. Humorous Analogy */}
                <motion.div
                  className="col-span-1 md:col-span-2 macos-card p-6 bg-white dark:bg-[#120505] border-red-200 dark:border-red-500/30 shadow-[0_0_30px_rgba(220,38,38,0.05)] dark:shadow-[0_0_30px_rgba(220,38,38,0.1)] hover:border-red-300 dark:hover:border-red-500/50 transition-colors"
                  variants={{
                    hidden: { opacity: 0, scale: 0.95 },
                    visible: { opacity: 1, scale: 1 }
                  }}
                >
                  <h3 className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-3 flex items-center gap-2">
                    <Sparkles className="w-3 h-3" /> The "Analogy"
                  </h3>
                  <p className="text-gray-800 dark:text-gray-200 text-lg font-medium leading-relaxed">
                    {report.roast.humorousAnalogy}
                  </p>
                </motion.div>

                {/* 3. Roast Summary */}
                <motion.div
                  className="col-span-1 md:col-span-2 macos-card p-6 bg-white dark:bg-[#120505] border-red-200 dark:border-red-500/30 shadow-[0_0_30px_rgba(220,38,38,0.05)] dark:shadow-[0_0_30px_rgba(220,38,38,0.1)] hover:border-red-300 dark:hover:border-red-500/50 transition-colors"
                  variants={{
                    hidden: { opacity: 0, scale: 0.95 },
                    visible: { opacity: 1, scale: 1 }
                  }}
                >
                  <h3 className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3" /> Why It Hurts
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {report.roast.summary}
                  </p>
                </motion.div>
              </>
            )}

            {/* 1. Verdict (Large) */}
            <motion.div
              className={clsx(
                "md:col-span-2 md:row-span-2 relative overflow-hidden rounded-3xl p-8 md:p-10 flex flex-col justify-between",
                theme === "light" ? 
                  "bg-white/70 border border-white/80 backdrop-blur-3xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/60 before:to-transparent before:pointer-events-none" :
                  report.verdict === "Build Now" ? "bg-gradient-to-br from-[#061208] via-[#050f0d] to-[#0a0a0f] border-white/[0.08]" :
                  report.verdict === "Build with Caution" ? "bg-gradient-to-br from-[#120e06] via-[#0f0c05] to-[#0a0a0f] border-white/[0.08]" :
                  "bg-gradient-to-br from-[#120608] via-[#0f0a0a] to-[#0a0808] border-white/[0.08]"
              )}
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: { opacity: 1, scale: 1 }
              }}
            >
              {/* Subtle color tint behind glass (light mode only) */}
              {theme === "light" && (
                <>
                  <div className={clsx(
                    "absolute inset-0 opacity-[0.12] rounded-3xl",
                    report.verdict === "Build Now" ? "bg-gradient-to-br from-emerald-400 to-teal-300" :
                    report.verdict === "Build with Caution" ? "bg-gradient-to-br from-amber-400 to-orange-300" :
                    "bg-gradient-to-br from-rose-400 to-red-300"
                  )} />
                  {/* Glass shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/0 to-transparent rounded-3xl pointer-events-none" />
                </>
              )}

              {/* Background Typography Watermark */}
              <div className={clsx(
                "absolute -top-8 -right-12 text-[140px] md:text-[200px] font-black leading-none tracking-tighter select-none pointer-events-none z-10",
                theme === "light" ? "text-gray-900/[0.04]" : "text-white/[0.02]"
              )}>
                {report.verdict === "Build Now" ? "BUILD" : report.verdict === "Build with Caution" ? "CAUTION" : "PIVOT"}
              </div>

              {/* Ambient Glow */}
              <div className={clsx(
                "absolute rounded-full pointer-events-none",
                theme === "light" ? (
                  report.verdict === "Build Now" ? "bottom-0 left-0 w-[300px] h-[300px] bg-emerald-400/[0.06] blur-[100px]" :
                  report.verdict === "Build with Caution" ? "bottom-0 left-0 w-[300px] h-[300px] bg-amber-400/[0.06] blur-[100px]" : 
                  "bottom-0 left-0 w-[300px] h-[300px] bg-rose-400/[0.06] blur-[100px]"
                ) : (
                  report.verdict === "Build Now" ? "top-0 left-0 w-[400px] h-[400px] bg-emerald-500/10 blur-[120px]" :
                  report.verdict === "Build with Caution" ? "top-0 left-0 w-[400px] h-[400px] bg-amber-500/10 blur-[120px]" : 
                  "top-0 left-0 w-[400px] h-[400px] bg-rose-500/10 blur-[120px]"
                )
              )} />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className={clsx(
                    "w-12 h-12 rounded-2xl border flex items-center justify-center backdrop-blur-sm",
                    theme === "light" ? (
                      report.verdict === "Build Now" ? "bg-emerald-100 border-emerald-300/50" :
                      report.verdict === "Build with Caution" ? "bg-amber-100 border-amber-300/50" :
                      "bg-rose-100 border-rose-300/50"
                    ) : (
                      report.verdict === "Build Now" ? "bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-emerald-500/30" :
                      report.verdict === "Build with Caution" ? "bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/30" :
                      "bg-gradient-to-br from-rose-500/20 to-red-500/20 border-rose-500/30"
                    )
                  )}>
                    {report.verdict === "Build Now" ? <Check className={clsx("w-6 h-6", theme === "light" ? "text-emerald-600" : "text-emerald-300")} /> :
                     report.verdict === "Build with Caution" ? <AlertTriangle className={clsx("w-6 h-6", theme === "light" ? "text-amber-600" : "text-amber-300")} /> :
                     <ShieldAlert className={clsx("w-6 h-6", theme === "light" ? "text-rose-600" : "text-rose-300")} />}
                  </div>
                  <span className={clsx(
                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider",
                    theme === "light" ? (
                      report.verdict === "Build Now" ? "bg-emerald-100 border-emerald-300/50 text-emerald-700" :
                      report.verdict === "Build with Caution" ? "bg-amber-100 border-amber-300/50 text-amber-700" :
                      "bg-rose-100 border-rose-300/50 text-rose-700"
                    ) : (
                      report.verdict === "Build Now" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" :
                      report.verdict === "Build with Caution" ? "bg-amber-500/10 border-amber-500/20 text-amber-300" :
                      "bg-rose-500/10 border-rose-500/20 text-rose-300"
                    )
                  )}>
                    Final Verdict
                  </span>
                </div>
                <h2 className={clsx(
                  "text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter break-words leading-[0.9] mb-6",
                  theme === "light" ? (
                    report.verdict === "Build Now" ? "text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600" :
                    report.verdict === "Build with Caution" ? "text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600" :
                    "text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-red-500 to-rose-600"
                  ) : (
                    report.verdict === "Build Now" ? "text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400" :
                    report.verdict === "Build with Caution" ? "text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-200 to-amber-400" :
                    "text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-red-200 to-rose-400"
                  )
                )}>
                  {report.verdict}
                </h2>
              </div>
              <p className={clsx(
                "relative z-10 text-base md:text-lg leading-relaxed",
                theme === "light" ? "text-gray-800" : "text-gray-300"
              )}>
                {report.verdictJustification}
              </p>
            </motion.div>

            {/* 2. Viability Score (Animated Gauge) */}
            <motion.div
              className={clsx(
                "md:col-span-1 md:row-span-1 relative overflow-hidden rounded-3xl p-6 flex flex-col items-center justify-center",
                theme === "light" ?
                  "bg-white/70 border-2 border-white shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)] backdrop-blur-3xl" :
                  "bg-gradient-to-br from-[#08080c] via-[#0a0810] to-[#0a0a0f] border border-white/[0.08]"
              )}
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: { opacity: 1, scale: 1 }
              }}
            >
              {/* Subtle color tint (light mode) */}
              {theme === "light" && (
                <>
                  <div className={clsx(
                    "absolute inset-0 opacity-[0.12] rounded-3xl",
                    report.viabilityScore > 70 ? "bg-gradient-to-br from-emerald-400 to-teal-300" :
                    report.viabilityScore > 40 ? "bg-gradient-to-br from-amber-400 to-orange-300" : "bg-gradient-to-br from-rose-400 to-red-300"
                  )} />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/0 to-transparent rounded-3xl pointer-events-none" />
                </>
              )}

              {/* Background Glow */}
              <div className={clsx(
                "absolute rounded-full transition-opacity duration-700 pointer-events-none",
                theme === "light" ? (
                  report.viabilityScore > 70 ? "bottom-0 left-0 w-[200px] h-[200px] bg-emerald-400/[0.06] blur-[80px]" :
                  report.viabilityScore > 40 ? "bottom-0 left-0 w-[200px] h-[200px] bg-amber-400/[0.06] blur-[80px]" :
                  "bottom-0 left-0 w-[200px] h-[200px] bg-rose-400/[0.06] blur-[80px]"
                ) : (
                  report.viabilityScore > 70 ? "inset-0 bg-gradient-to-br from-emerald-500/15 to-transparent blur-[100px]" :
                  report.viabilityScore > 40 ? "inset-0 bg-gradient-to-br from-amber-500/15 to-transparent blur-[100px]" :
                  "inset-0 bg-gradient-to-br from-rose-500/15 to-transparent blur-[100px]"
                )
              )} />

              <div className="relative z-10">
                <CircularGauge
                  score={report.viabilityScore || 50}
                  label="Viability Score"
                  subLabel="AI Prediction"
                  isRoastMode={!!report.roast}
                />
              </div>
            </motion.div>

            {/* 3. Problem Urgency */}
            <motion.div
              className={clsx(
                "md:col-span-1 md:row-span-1 relative overflow-hidden rounded-3xl p-6 flex flex-col justify-center gap-6",
                theme === "light" ?
                  "bg-white/70 border-2 border-white shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)] backdrop-blur-3xl" :
                  "bg-gradient-to-br from-[#0a0808] via-[#0c0608] to-[#08080c] border border-white/[0.08]"
              )}
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: { opacity: 1, scale: 1 }
              }}
            >
              {/* Subtle color tint (light mode) */}
              {theme === "light" && (
                <>
                  <div className={clsx(
                    "absolute inset-0 opacity-[0.12] rounded-3xl",
                    report.problemSeverity >= 8 ? "bg-gradient-to-br from-rose-400 to-red-300" :
                    report.problemSeverity >= 5 ? "bg-gradient-to-br from-amber-400 to-orange-300" :
                    "bg-gradient-to-br from-blue-400 to-indigo-300"
                  )} />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/0 to-transparent rounded-3xl pointer-events-none" />
                </>
              )}

              {/* Background Glow */}
              <div className={clsx(
                "absolute rounded-full pointer-events-none",
                theme === "light" ? (
                  report.problemSeverity >= 8 ? "top-0 right-0 w-[150px] h-[150px] bg-rose-400/[0.06] blur-[60px]" :
                  report.problemSeverity >= 5 ? "top-0 right-0 w-[150px] h-[150px] bg-amber-400/[0.06] blur-[60px]" :
                  "top-0 right-0 w-[150px] h-[150px] bg-blue-400/[0.06] blur-[60px]"
                ) : (
                  report.problemSeverity >= 8 ? "top-0 right-0 w-[200px] h-[200px] bg-rose-500/10 blur-[80px]" :
                  report.problemSeverity >= 5 ? "top-0 right-0 w-[200px] h-[200px] bg-amber-500/10 blur-[80px]" :
                  "top-0 right-0 w-[200px] h-[200px] bg-blue-500/10 blur-[80px]"
                )
              )} />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className={clsx("text-lg font-black tracking-tight mb-1", theme === "light" ? "text-gray-900" : "text-white/90")}>Problem Urgency</h3>
                    <p className={clsx("text-[10px] font-medium", theme === "light" ? "text-gray-600" : "text-gray-400")}>How bad do they need it?</p>
                  </div>
                  <div className="text-right">
                    <span className={clsx("text-5xl font-black tracking-tighter",
                      report.problemSeverity >= 8 ? "text-transparent bg-clip-text bg-gradient-to-r from-rose-300 to-red-400" :
                      report.problemSeverity >= 5 ? "text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400" : 
                      "text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-400"
                    )}>
                      {report.problemSeverity}
                    </span>
                    <span className="text-sm text-gray-500 block mt-1">/10</span>
                  </div>
                </div>

                {/* Custom Bar Chart Visualization */}
                <div className={clsx(
                  "w-full h-4 rounded-full overflow-hidden backdrop-blur-sm border",
                  theme === "light" ? "bg-gray-100 border-gray-200" : "bg-white/5 border-white/10"
                )}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${report.problemSeverity * 10}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={clsx("h-full rounded-full relative",
                      report.problemSeverity >= 8 ? "bg-gradient-to-r from-rose-500 to-red-500" :
                      report.problemSeverity >= 5 ? "bg-gradient-to-r from-amber-500 to-orange-500" : 
                      "bg-gradient-to-r from-blue-500 to-indigo-500"
                    )}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* 4. Main Challenge (was Failure Risk) */}
            <motion.div
              className={clsx(
                "md:col-span-2 relative overflow-hidden rounded-3xl p-8 md:p-10",
                theme === "light" ?
                  "bg-white/70 border-2 border-white shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)] backdrop-blur-3xl" :
                  "bg-gradient-to-br from-[#120608] via-[#0f0505] to-[#0a0808] border border-white/[0.08]"
              )}
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: { opacity: 1, scale: 1 }
              }}
            >
              {/* Subtle color tint (light mode) */}
              {theme === "light" && (
                <>
                  <div className="absolute inset-0 opacity-[0.12] rounded-3xl bg-gradient-to-br from-rose-400 to-red-300" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/0 to-transparent rounded-3xl pointer-events-none" />
                </>
              )}

              {/* Background Typography Watermark */}
              <div className={clsx(
                "absolute -bottom-6 -left-8 text-[120px] md:text-[160px] font-black leading-none tracking-tighter select-none pointer-events-none z-10",
                theme === "light" ? "text-gray-900/[0.03]" : "text-white/[0.02]"
              )}>
                FAILS
              </div>

              {/* Ambient Glow */}
              <div className={clsx(
                "absolute rounded-full pointer-events-none",
                theme === "light" ?
                  "top-0 right-0 w-[250px] h-[250px] bg-rose-400/[0.06] blur-[80px]" :
                  "top-0 right-0 w-[300px] h-[300px] bg-rose-600/10 blur-[100px]"
              )} />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className={clsx(
                    "w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-sm",
                    theme === "light" ?
                      "bg-rose-100 border border-rose-300/50" :
                      "bg-gradient-to-br from-rose-500/20 to-red-500/20 border border-rose-500/30"
                  )}>
                    <ShieldAlert className={clsx("w-6 h-6", theme === "light" ? "text-rose-600" : "text-rose-300")} />
                  </div>
                  <div>
                    <h3 className={clsx(
                      "text-2xl md:text-3xl font-black tracking-tight text-transparent bg-clip-text",
                      theme === "light" ? "bg-gradient-to-r from-rose-600 to-red-600" : "bg-gradient-to-r from-rose-300 to-red-300"
                    )}>
                      Biggest Challenge
                    </h3>
                    <p className={clsx("text-xs mt-0.5", theme === "light" ? "text-gray-600" : "text-gray-400")}>Why most similar ideas fail</p>
                  </div>
                </div>
                <div className={clsx(
                  "p-6 rounded-2xl backdrop-blur-sm",
                  theme === "light" ?
                    "border border-rose-300/30 bg-rose-100/30" :
                    "border border-rose-500/20 bg-gradient-to-br from-rose-500/5 to-red-500/5"
                )}>
                  <p className={clsx(
                    "text-base md:text-lg leading-relaxed",
                    theme === "light" ? "text-gray-800" : "text-gray-200"
                  )}>
                    {report.whyItFails}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* 5. Summary */}
            <motion.div
              className={clsx(
                "md:col-span-2 md:row-span-2 relative overflow-hidden rounded-3xl p-8 md:p-10",
                theme === "light" ?
                  "bg-white/70 border-2 border-white shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)] backdrop-blur-3xl" :
                  "bg-gradient-to-br from-[#060810] via-[#050d10] to-[#0a0a0f] border border-white/[0.08]"
              )}
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: { opacity: 1, scale: 1 }
              }}
            >
              {/* Subtle color tint (light mode) */}
              {theme === "light" && (
                <>
                  <div className="absolute inset-0 opacity-[0.12] rounded-3xl bg-gradient-to-br from-blue-400 to-indigo-300" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/0 to-transparent rounded-3xl pointer-events-none" />
                </>
              )}

              {/* Background Typography Watermark */}
              <div className={clsx(
                "absolute -top-6 -right-10 text-[120px] md:text-[180px] font-black leading-none tracking-tighter select-none pointer-events-none z-10",
                theme === "light" ? "text-gray-900/[0.03]" : "text-white/[0.02]"
              )}>
                EXEC
              </div>

              {/* Ambient Glow */}
              <div className={clsx(
                "absolute rounded-full pointer-events-none",
                theme === "light" ?
                  "bottom-0 left-0 w-[250px] h-[250px] bg-blue-400/[0.06] blur-[80px]" :
                  "bottom-0 left-0 w-[350px] h-[350px] bg-blue-600/8 blur-[120px]"
              )} />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className={clsx(
                    "w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-sm",
                    theme === "light" ?
                      "bg-blue-100 border border-blue-300/50" :
                      "bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30"
                  )}>
                    <BarChart3 className={clsx("w-6 h-6", theme === "light" ? "text-blue-600" : "text-blue-300")} />
                  </div>
                  <div>
                    <h3 className={clsx(
                      "text-3xl md:text-4xl font-black tracking-tight text-transparent bg-clip-text",
                      theme === "light" ? "bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600" : "bg-gradient-to-r from-blue-300 via-indigo-200 to-blue-400"
                    )}>
                      Executive Summary
                    </h3>
                  </div>
                </div>
                
                <div className={clsx(
                  "p-6 rounded-2xl backdrop-blur-sm mb-6",
                  theme === "light" ?
                    "border border-blue-300/30 bg-blue-100/30" :
                    "border border-blue-500/10 bg-gradient-to-br from-blue-500/5 to-indigo-500/5"
                )}>
                  <p className={clsx(
                    "leading-relaxed text-base",
                    theme === "light" ? "text-gray-800" : "text-gray-200"
                  )}>
                    {report.summary}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/[0.08]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={clsx(
                      "w-9 h-9 rounded-xl flex items-center justify-center",
                      theme === "light" ?
                        "bg-violet-100 border border-violet-300/50" :
                        "bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20"
                    )}>
                      <Users className={clsx("w-4 h-4", theme === "light" ? "text-violet-600" : "text-violet-400")} />
                    </div>
                    <h4 className={clsx(
                      "text-sm uppercase font-black tracking-tight",
                      theme === "light" ? "text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600" : "text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-purple-400"
                    )}>
                      Target Audience
                    </h4>
                  </div>
                  <p className={clsx(
                    "text-sm leading-relaxed mb-6 pl-1",
                    theme === "light" ? "text-gray-700" : "text-white/90"
                  )}>{report.targetUsers}</p>

                {/* Aesthetic Market Intelligence Section */}
                <div className={clsx(
                  "mt-6 rounded-2xl overflow-hidden relative backdrop-blur-sm",
                  theme === "light" ?
                    "bg-blue-100/30 border border-blue-300/30" :
                    "bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-blue-500/5 border border-blue-500/10"
                )}>
                  {/* Glowing accent bar */}
                  <div className={clsx(
                    "absolute top-0 left-0 w-1 h-full",
                    theme === "light" ? "bg-gradient-to-b from-blue-500 to-indigo-500" : "bg-gradient-to-b from-blue-500 to-indigo-500"
                  )} />
                  
                  {/* Subtle glow */}
                  <div className={clsx(
                    "absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl",
                    theme === "light" ? "bg-blue-400/5" : "bg-blue-500/5"
                  )} />

                  <div className="p-5 relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={clsx(
                        "w-8 h-8 rounded-lg flex items-center justify-center",
                        theme === "light" ?
                          "bg-blue-100 border border-blue-300/50" :
                          "bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30"
                      )}>
                        <Map className={clsx("w-4 h-4", theme === "light" ? "text-blue-600" : "text-blue-400")} />
                      </div>
                      <h5 className={clsx(
                        "text-xs uppercase font-black tracking-wide",
                        theme === "light" ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600" : "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400"
                      )}>
                        Market Intelligence (2025-26)
                      </h5>
                    </div>

                    <div className="space-y-4">
                      {report.marketTrends ? (
                        <>
                          <div className={clsx(
                            "text-sm leading-relaxed font-medium pl-1",
                            theme === "light" ? "text-gray-700" : "text-white/80"
                          )}>
                            {report.marketTrends}
                          </div>

                          {report.sources && report.sources.length > 0 && (
                            <div className={clsx(
                              "mt-5 pt-5",
                              theme === "light" ? "border-t border-blue-300/20" : "border-t border-blue-500/10"
                            )}>
                              <div className="flex items-center gap-2 mb-3">
                                <Search className={clsx("w-3 h-3", theme === "light" ? "text-blue-600" : "text-blue-400")} />
                                <span className={clsx(
                                  "text-[10px] uppercase font-black tracking-wider",
                                  theme === "light" ? "text-blue-600/90" : "text-blue-400/90"
                                )}>
                                  Verified Sources
                                </span>
                              </div>
                              <div className="flex flex-col gap-2">
                                {report.sources.map((source, idx) => {
                                  // Simple parsing: Try to split by common separators or find URL
                                  const urlMatch = source.match(/(https?:\/\/[^\s]+)/);
                                  const url = urlMatch ? urlMatch[0] : null;
                                  let domain = url ? new URL(url).hostname.replace('www.', '') : null;
                                  const text = source.replace(url || "", "").replace(/[-:]\s*$/, "").trim() || (domain ? domain.charAt(0).toUpperCase() + domain.slice(1) : "Source " + (idx + 1));

                                  return (
                                    <a
                                      key={idx}
                                      href={url || "#"}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={clsx(
                                        "flex items-start gap-3 p-3 rounded-xl transition-all group/link backdrop-blur-sm",
                                        theme === "light" ?
                                          "bg-blue-100/40 border border-blue-300/30 hover:bg-blue-100/60 hover:border-blue-400/40" :
                                          "bg-blue-500/5 border border-blue-500/10 hover:bg-blue-500/10 hover:border-blue-400/30"
                                      )}
                                    >
                                      <div className={clsx(
                                        "mt-0.5 transition-colors",
                                        theme === "light" ? "text-blue-600 group-hover/link:text-blue-700" : "text-blue-400 group-hover/link:text-blue-300"
                                      )}>
                                        <ExternalLink className="w-4 h-4" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className={clsx(
                                          "text-xs font-semibold truncate transition-colors",
                                          theme === "light" ? "text-gray-900 group-hover/link:text-blue-700" : "text-white group-hover/link:text-blue-300"
                                        )}>
                                          {text}
                                        </div>
                                        {url && (
                                          <div className={clsx(
                                            "text-[10px] truncate mt-1 font-mono",
                                            theme === "light" ? "text-blue-600/60" : "text-blue-400/60"
                                          )}>
                                            {new URL(url).hostname}
                                          </div>
                                        )}
                                      </div>
                                    </a>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-xs text-gray-500 italic">
                          Analysis based on general market models. Run a fresh check for real-time sources.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                </div>
              </div>
            </motion.div>

            {/* 6. Demand Strength */}
            <motion.div
              className={clsx(
                "relative overflow-hidden rounded-3xl p-6 flex flex-col justify-between",
                theme === "light" ?
                  "bg-white/70 border-2 border-white shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)] backdrop-blur-3xl" :
                  "bg-gradient-to-br from-[#08100a] via-[#060f0d] to-[#0a0a0f] border border-white/[0.08]"
              )}
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: { opacity: 1, scale: 1 }
              }}
            >
              {/* Subtle color tint (light mode) */}
              {theme === "light" && (
                <>
                  <div className={clsx(
                    "absolute inset-0 opacity-[0.12] rounded-3xl",
                    report.marketDemand === "High" ? "bg-gradient-to-br from-emerald-400 to-teal-300" :
                    report.marketDemand === "Medium" ? "bg-gradient-to-br from-amber-400 to-orange-300" :
                    "bg-gradient-to-br from-rose-400 to-red-300"
                  )} />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/0 to-transparent rounded-3xl pointer-events-none" />
                </>
              )}

              {/* Background Glow */}
              <div className={clsx(
                "absolute rounded-full pointer-events-none",
                theme === "light" ? (
                  report.marketDemand === "High" ? "top-0 left-0 w-[200px] h-[200px] bg-emerald-400/[0.06] blur-[80px]" :
                  report.marketDemand === "Medium" ? "top-0 left-0 w-[200px] h-[200px] bg-amber-400/[0.06] blur-[80px]" :
                  "top-0 left-0 w-[200px] h-[200px] bg-rose-400/[0.06] blur-[80px]"
                ) : (
                  report.marketDemand === "High" ? "top-0 left-0 w-[250px] h-[250px] bg-emerald-500/10 blur-[100px]" :
                  report.marketDemand === "Medium" ? "top-0 left-0 w-[250px] h-[250px] bg-amber-500/10 blur-[100px]" :
                  "top-0 left-0 w-[250px] h-[250px] bg-rose-500/10 blur-[100px]"
                )
              )} />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className={clsx("text-lg font-black tracking-tight mb-1", theme === "light" ? "text-gray-900" : "text-white/90")}>Demand Strength</h3>
                    <p className={clsx("text-[10px] font-medium", theme === "light" ? "text-gray-600" : "text-gray-400")}>Search Volume Interest</p>
                  </div>
                  <div className={clsx(
                    "w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-sm",
                    theme === "light" ? (
                      report.marketDemand === "High" ? "bg-emerald-100 border border-emerald-300/50 text-emerald-600" :
                      report.marketDemand === "Medium" ? "bg-amber-100 border border-amber-300/50 text-amber-600" :
                      "bg-rose-100 border border-rose-300/50 text-rose-600"
                    ) : (
                      report.marketDemand === "High" ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" :
                      report.marketDemand === "Medium" ? "bg-amber-500/10 border border-amber-500/20 text-amber-400" :
                      "bg-rose-500/10 border border-rose-500/20 text-rose-400"
                    )
                  )}>
                    {report.marketDemand === "High" ? <TrendingUp className="w-5 h-5" /> :
                      report.marketDemand === "Medium" ? <Minus className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                  </div>
                </div>

                <h3 className={clsx(
                  "text-4xl font-black mb-4 tracking-tight text-transparent bg-clip-text",
                  theme === "light" ? (
                    report.marketDemand === "High" ? "bg-gradient-to-r from-emerald-600 to-teal-600" :
                    report.marketDemand === "Medium" ? "bg-gradient-to-r from-amber-600 to-orange-600" :
                    "bg-gradient-to-r from-rose-600 to-red-600"
                  ) : (
                    report.marketDemand === "High" ? "bg-gradient-to-r from-emerald-300 to-teal-400" :
                    report.marketDemand === "Medium" ? "bg-gradient-to-r from-amber-300 to-orange-400" :
                    "bg-gradient-to-r from-rose-300 to-red-400"
                  )
                )}>
                  {report.marketDemand}
                </h3>

                {/* Signal Bars Visualization */}
                <div className={clsx(
                  "flex items-end gap-2 h-16 mb-3 rounded-xl p-2 backdrop-blur-sm",
                  theme === "light" ? "bg-gray-200/50 border border-gray-300/30" : "bg-white/5 border border-white/10"
                )}>
                  {[1, 2, 3, 4, 5].map((bar) => {
                    const isActive =
                      (report.marketDemand === "High" && bar <= 5) ||
                      (report.marketDemand === "Medium" && bar <= 3) ||
                      (report.marketDemand === "Low" && bar <= 1);

                    return (
                      <motion.div
                        key={bar}
                        initial={{ height: "20%" }}
                        animate={{ height: `${bar * 20}%` }}
                        transition={{ delay: 0.2 + (bar * 0.1) }}
                        className={clsx(
                          "w-full rounded-lg transition-colors duration-500 relative overflow-hidden",
                          isActive ? (
                            report.marketDemand === "High" ? "bg-gradient-to-t from-emerald-500 to-teal-400" :
                            report.marketDemand === "Medium" ? "bg-gradient-to-t from-amber-500 to-orange-400" : 
                            "bg-gradient-to-t from-rose-500 to-red-400"
                          ) : "bg-white/5"
                        )}
                      >
                        {isActive && <div className="absolute inset-0 bg-white/20 animate-pulse" />}
                      </motion.div>
                    );
                  })}
                </div>
                {report.demandJustification && (
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {report.demandJustification}
                  </p>
                )}
              </div>
            </motion.div>

            {/* 7. Roadmap Button - Feature Card Style */}
            <motion.div
              className={clsx(
                "relative overflow-hidden rounded-3xl p-0 flex flex-col justify-center items-center text-center cursor-pointer transition-all duration-300 group",
                theme === "light" ?
                  "bg-white/70 border-2 border-white shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)] backdrop-blur-3xl" :
                  "bg-gradient-to-br from-[#06080e] via-[#080a10] to-[#0a080e] border border-white/[0.08]"
              )}
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: { opacity: 1, scale: 1 }
              }}
              onClick={roadmap ? () => setShowRoadmapModal(true) : handleGenerateRoadmap}
            >
              {/* Subtle color tint (light mode) */}
              {theme === "light" && (
                <>
                  <div className={clsx(
                    "absolute inset-0 opacity-[0.12] rounded-3xl",
                    roadmap ? "bg-gradient-to-br from-emerald-400 to-teal-300" : "bg-gradient-to-br from-indigo-400 to-violet-300"
                  )} />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/0 to-transparent rounded-3xl pointer-events-none" />
                </>
              )}

              {/* Background Watermark */}
              <div className={clsx(
                "absolute inset-0 flex items-center justify-center pointer-events-none z-10",
                theme === "light" ? "text-gray-900/[0.03]" : "text-white/[0.02]"
              )}>
                <span className="text-[140px] font-black tracking-tighter select-none">
                  {roadmap ? "READY" : "PLAN"}
                </span>
              </div>

              {/* Animated Gradient Glow on Hover */}
              <div className={clsx(
                "absolute inset-0 transition-all duration-500",
                theme === "light" ?
                  (roadmap ? "bg-gradient-to-br from-emerald-400/0 via-teal-400/0 to-emerald-400/0 group-hover:from-emerald-400/[0.06] group-hover:via-teal-400/[0.06] group-hover:to-emerald-400/[0.06] blur-xl" :
                   "bg-gradient-to-br from-indigo-400/0 via-violet-400/0 to-blue-400/0 group-hover:from-indigo-400/[0.06] group-hover:via-violet-400/[0.06] group-hover:to-blue-400/[0.06] blur-xl") :
                  "bg-gradient-to-br from-indigo-500/0 via-violet-500/0 to-blue-500/0 group-hover:from-indigo-500/10 group-hover:via-violet-500/10 group-hover:to-blue-500/10 blur-2xl"
              )} />

              <div className="p-6 md:p-8 flex flex-col items-center z-10 w-full h-full justify-center">
                <div className={clsx(
                  "w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 backdrop-blur-sm",
                  theme === "light" ? (
                    roadmap ?
                      "bg-emerald-100 border border-emerald-300/50 text-emerald-600 group-hover:bg-emerald-200/80" :
                      "bg-indigo-100 border border-indigo-300/50 text-indigo-600 group-hover:scale-110 group-hover:border-indigo-400/60"
                  ) : (
                    roadmap ?
                      "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/20" :
                      "bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 text-indigo-400 group-hover:scale-110 group-hover:border-indigo-400/40"
                  )
                )}>
                  {isGeneratingRoadmap ? (
                    <RefreshCw className="w-8 h-8 animate-spin" />
                  ) : roadmap ? (
                    <Check className="w-8 h-8" />
                  ) : (
                    <Map className="w-8 h-8" />
                  )}
                </div>

                <h3 className={clsx(
                  "text-2xl font-black mb-2 tracking-tight transition-colors text-transparent bg-clip-text",
                  theme === "light" ? (
                    roadmap ? "bg-gradient-to-r from-emerald-600 to-teal-600" : "bg-gradient-to-r from-gray-900 to-gray-700 group-hover:from-indigo-600 group-hover:to-violet-600"
                  ) : (
                    roadmap ? "bg-gradient-to-r from-emerald-300 to-teal-400" : "bg-gradient-to-r from-white to-white group-hover:from-indigo-300 group-hover:to-violet-400"
                  )
                )}>
                  {roadmap ? "Plan Ready" : "Generate Roadmap"}
                </h3>

                <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors mb-1">
                  {roadmap ? "Click to view your strategy" : "Create a 4-week execution plan"}
                </p>

                {!roadmap && !isGeneratingRoadmap && (
                  <div className="mt-3 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <span className={clsx(
                      "text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5",
                      theme === "light" ? "text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600" : "text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400"
                    )}>
                      Start Building <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* 8. Risks - Alert Style */}
            <motion.div
              className={clsx(
                "md:col-span-2 relative overflow-hidden rounded-3xl p-8 md:p-10",
                theme === "light" ?
                  "bg-white/70 border-2 border-white shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)] backdrop-blur-3xl" :
                  "bg-gradient-to-br from-[#120a06] via-[#0f0805] to-[#0a0808] border border-white/[0.08]"
              )}
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: { opacity: 1, scale: 1 }
              }}
            >
              {/* Subtle color tint (light mode) */}
              {theme === "light" && (
                <>
                  <div className="absolute inset-0 opacity-[0.12] rounded-3xl bg-gradient-to-br from-orange-400 to-amber-300" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/0 to-transparent rounded-3xl pointer-events-none" />
                </>
              )}

              {/* Background Typography Watermark */}
              <div className={clsx(
                "absolute -top-6 -right-10 text-[120px] md:text-[180px] font-black leading-none tracking-tighter select-none pointer-events-none z-10",
                theme === "light" ? "text-gray-900/[0.03]" : "text-white/[0.02]"
              )}>
                THREATS
              </div>

              {/* Ambient Glow */}
              <div className={clsx(
                "absolute rounded-full pointer-events-none",
                theme === "light" ?
                  "top-0 left-0 w-[250px] h-[250px] bg-orange-400/[0.06] blur-[80px]" :
                  "top-0 left-0 w-[350px] h-[350px] bg-orange-600/10 blur-[120px]"
              )} />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className={clsx(
                    "w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-sm",
                    theme === "light" ?
                      "bg-orange-100 border border-orange-300/50" :
                      "bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/30"
                  )}>
                    <AlertTriangle className={clsx("w-6 h-6", theme === "light" ? "text-orange-600" : "text-orange-300")} />
                  </div>
                  <div>
                    <h3 className={clsx(
                      "text-3xl md:text-4xl font-black tracking-tight text-transparent bg-clip-text",
                      theme === "light" ? "bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600" : "bg-gradient-to-r from-orange-300 via-amber-200 to-orange-400"
                    )}>
                      Potential Risks
                    </h3>
                    <p className={clsx("text-xs mt-1", theme === "light" ? "text-gray-600" : "text-gray-400")}>What could go wrong</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {report.risks.split(/(?:\. |\n- )/).map((risk, i) => {
                    const cleanRisk = risk.replace(/^- /, '').trim();
                    if (!cleanRisk) return null;
                    return (
                      <div key={i} className={clsx(
                        "group flex gap-4 items-start p-5 rounded-2xl transition-all duration-300 backdrop-blur-sm",
                        theme === "light" ?
                          "bg-orange-100/30 border border-orange-300/30 hover:border-orange-400/40" :
                          "bg-gradient-to-br from-orange-500/5 to-amber-500/5 border border-orange-500/10 hover:border-orange-500/30"
                      )}>
                        <div className={clsx(
                          "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                          theme === "light" ?
                            "bg-orange-100 border border-orange-300/50" :
                            "bg-orange-500/10 border border-orange-500/20"
                        )}>
                          <AlertOctagon className={clsx("w-5 h-5", theme === "light" ? "text-orange-600" : "text-orange-400")} />
                        </div>
                        <span className={clsx(
                          "text-sm leading-relaxed transition-colors flex-1",
                          theme === "light" ? "text-gray-700 group-hover:text-gray-900" : "text-gray-200 group-hover:text-white"
                        )}>{cleanRisk}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>

            {/* 9. Monetization - Premium Revenue Stream Cards */}
            <motion.div
              className={clsx(
                "md:col-span-2 relative overflow-hidden rounded-3xl",
                theme === "light" ?
                  "bg-white/70 border border-white/80 backdrop-blur-3xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/60 before:to-transparent before:pointer-events-none" :
                  report.roast
                    ? "bg-gradient-to-br from-[#120608] via-[#0f0a0a] to-[#0a0808] border border-white/[0.08]"
                    : "bg-gradient-to-br from-[#061208] via-[#060f0d] to-[#0a0a0f] border border-white/[0.08]"
              )}
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: { opacity: 1, scale: 1 }
              }}
            >
              {/* Subtle color tint (light mode) */}
              {theme === "light" && (
                <div className="absolute inset-0 opacity-[0.08] rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-300" />
              )}

              {/* Background Typography Watermark */}
              <div className={clsx(
                "absolute -top-4 -right-8 text-[120px] md:text-[160px] font-black leading-none tracking-tighter select-none pointer-events-none z-10",
                theme === "light" ? "text-gray-900/[0.03]" : "text-white/[0.02]"
              )}>
                MONEY
              </div>

              {/* Glow Effect */}
              <div className={clsx(
                "absolute rounded-full pointer-events-none",
                theme === "light" ?
                  "top-0 right-0 w-[250px] h-[250px] bg-emerald-400/[0.06] blur-[80px]" :
                  report.roast ? "top-0 right-0 w-[300px] h-[300px] bg-red-500/8 blur-[100px]" : "top-0 right-0 w-[300px] h-[300px] bg-emerald-500/10 blur-[100px]"
              )} />

              <div className="p-8 md:p-10 relative z-10">
                <div className="flex items-start justify-between mb-10">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={clsx(
                        "w-12 h-12 rounded-2xl border flex items-center justify-center backdrop-blur-sm",
                        report.roast
                          ? "bg-gradient-to-br from-red-500/20 to-orange-500/20 border-red-500/30"
                          : "bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-emerald-500/30"
                      )}>
                        <DollarSign className="w-6 h-6 text-emerald-300" />
                      </div>
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black tracking-tight leading-[0.95] mb-2">
                      <span className={clsx(
                        "text-transparent bg-clip-text",
                        report.roast
                          ? "bg-gradient-to-r from-red-300 via-orange-200 to-red-400"
                          : "bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400"
                      )}>
                        Monetization
                      </span>
                      <br />
                      <span className="text-white/90">Strategy</span>
                    </h3>
                    <p className="text-sm text-gray-400">{report.monetizationPaths?.length || 0} revenue streams</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {report.monetizationPaths?.map((path, i) => (
                    <div key={i} className={clsx(
                      "group flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.01] backdrop-blur-sm",
                      report.roast
                        ? "border-red-500/10 bg-gradient-to-br from-red-500/5 to-orange-500/5 hover:border-red-500/30"
                        : "border-emerald-500/10 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 hover:border-emerald-500/30"
                    )}>
                      {/* Number Badge */}
                      <div className={clsx(
                        "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0 border",
                        report.roast
                          ? "bg-gradient-to-br from-red-500/20 to-orange-500/20 text-red-200 border-red-500/20"
                          : "bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-200 border-emerald-500/20"
                      )}>
                        {i + 1}
                      </div>
                      <span className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors flex-1 leading-relaxed">
                        {path}
                      </span>
                      <ArrowRight className={clsx(
                        "w-5 h-5 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 flex-shrink-0",
                        report.roast ? "text-red-300" : "text-emerald-300"
                      )} />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* 10. Competitors - Premium Brand Cards */}
            <motion.div
              className={clsx(
                "md:col-span-2 relative overflow-hidden rounded-3xl",
                report.roast
                  ? "bg-gradient-to-br from-[#0c0612] via-[#0a0510] to-[#08080c] border border-white/[0.08]"
                  : "bg-gradient-to-br from-[#060810] via-[#050d10] to-[#0a0a0f] border border-white/[0.08]"
              )}
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: { opacity: 1, scale: 1 }
              }}
            >
              {/* Background Typography Watermark */}
              <div className="absolute -top-4 -right-8 text-[120px] md:text-[160px] font-black text-white/[0.02] leading-none tracking-tighter select-none pointer-events-none">
                RIVALS
              </div>

              {/* Glow Effect */}
              <div className={clsx(
                "absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full blur-[100px] pointer-events-none",
                report.roast ? "bg-red-500/8" : "bg-blue-500/10"
              )} />

              <div className="p-8 md:p-10 relative z-10">
                <div className="flex items-start justify-between mb-10">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 flex items-center justify-center backdrop-blur-sm">
                        <Globe className="w-6 h-6 text-blue-300" />
                      </div>
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black tracking-tight leading-[0.95] mb-2">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-200 to-blue-400">
                        Major
                      </span>
                      <br />
                      <span className="text-white/90">Competitors</span>
                    </h3>
                    <p className="text-sm text-gray-400">{report.alternatives?.length || 0} players found</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {report.alternatives?.map((comp, i) => {
                    const urlMatch = comp.match(/(https?:\/\/[^\s]+)/);
                    const url = urlMatch ? urlMatch[0] : null;
                    const name = comp.replace(url || "", "").replace(/[\(\):]/g, "").trim() || "Competitor " + (i + 1);
                    const domain = url ? new URL(url).hostname : null;
                    const favicon = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=64` : null;

                    return (
                      <a
                        key={i}
                        href={url || `https://www.google.com/search?q=${encodeURIComponent(name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.08] hover:border-blue-500/30 hover:bg-white/[0.05] transition-all duration-300 backdrop-blur-sm"
                      >
                        {/* Brand Icon */}
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:border-blue-500/30 transition-colors">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          {favicon ? (
                            <img src={favicon} alt={name} className="w-6 h-6 object-contain opacity-70 group-hover:opacity-100 transition-opacity" />
                          ) : (
                            <Building2 className="w-5 h-5 text-gray-500 group-hover:text-blue-400 transition-colors" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-gray-200 group-hover:text-white truncate transition-colors mb-1">
                            {name}
                          </h4>
                          <p className="text-[10px] text-blue-400/60 group-hover:text-blue-400/90 truncate font-mono transition-colors">
                            {domain || "Search on Google ↗"}
                          </p>
                        </div>

                        <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </motion.div>
            {/* Premium Tools Section - Bold Typography Design */}
            <motion.div
              className="md:col-span-4 mt-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              {/* Section Header - Minimal */}
              <div className="flex items-center gap-4 mb-10">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">Premium Tools</span>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </div>

              {/* Typography-First Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">

                {/* Competitive Analysis - Hero Card (spans 7 cols) */}
                {canAccess("enterprise") ? (
                  <button
                    onClick={handleAnalyzeCompetitors}
                    disabled={isAnalyzingCompetitors}
                    className="md:col-span-7 group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c0612] via-[#0a0510] to-[#08080c] border border-white/[0.08] hover:border-violet-500/30 transition-all duration-700 p-8 md:p-10 min-h-[280px] flex flex-col justify-between text-left"
                  >
                    {/* Background Typography */}
                    <div className="absolute -top-4 -right-4 text-[120px] md:text-[180px] font-black text-white/[0.04] leading-none tracking-tighter select-none pointer-events-none">
                      COMPETE
                    </div>

                    {/* Ambient Glow */}
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-violet-600/20 rounded-full blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="relative z-10">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-[10px] font-bold text-violet-300 uppercase tracking-wider mb-6">
                        Enterprise
                      </span>

                      {/* Hero Typography */}
                      <h3 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[0.9] mb-4">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-purple-200 to-violet-400 group-hover:from-violet-200 group-hover:to-purple-300 transition-all duration-500">
                          Competitive
                        </span>
                        <br />
                        <span className="text-white/90">Analysis</span>
                      </h3>

                      <p className="text-sm text-gray-400 max-w-xs leading-relaxed group-hover:text-gray-300 transition-colors">
                        Deep market intelligence. Competitor mapping. Strategic opportunities.
                      </p>
                    </div>

                    <div className="relative z-10 flex items-center gap-3 text-violet-300 group-hover:text-violet-200 transition-colors">
                      {isAnalyzingCompetitors ? (
                        <>
                          <div className="w-5 h-5 border-2 border-violet-400/30 border-t-violet-400 rounded-full animate-spin" />
                          <span className="text-sm font-semibold">Analyzing...</span>
                        </>
                      ) : (
                        <>
                          <span className="text-sm font-semibold">Run Analysis</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                        </>
                      )}
                    </div>
                  </button>
                ) : (
                  <button onClick={() => setShowPricingModal(true)} className="md:col-span-7 group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c0612]/80 via-[#0a0510]/80 to-[#08080c]/80 border border-white/[0.05] hover:border-violet-500/20 transition-all duration-700 p-8 md:p-10 min-h-[280px] flex flex-col justify-between text-left">
                    {/* Background Typography */}
                    <div className="absolute -top-4 -right-4 text-[120px] md:text-[180px] font-black text-white/[0.05] leading-none tracking-tighter select-none pointer-events-none">
                      COMPETE
                    </div>

                    <div className="relative z-10">
                      <LockedBadge tier="enterprise" />

                      <h3 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[0.9] mb-4 mt-6">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400/80 to-purple-400/80">
                          Competitive
                        </span>
                        <br />
                        <span className="text-white/70">Analysis</span>
                      </h3>

                      <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
                        Deep market intelligence. Competitor mapping. Strategic opportunities.
                      </p>
                    </div>

                    <div className="relative z-10 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold text-sm shadow-xl shadow-violet-500/20 group-hover:shadow-violet-500/40 group-hover:scale-[1.02] transition-all duration-300 w-fit">
                      <Lock className="w-4 h-4" />
                      <span>Unlock Feature</span>
                    </div>
                  </button>
                )}

                {/* Market Size - Vertical Typography Card (spans 5 cols) */}
                {canAccess("enterprise") ? (
                  <button
                    onClick={handleCalculateMarketSize}
                    disabled={isCalculatingMarket}
                    className="md:col-span-5 group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#061210] via-[#050f0d] to-[#08080c] border border-white/[0.08] hover:border-emerald-500/30 transition-all duration-700 p-8 min-h-[280px] flex flex-col justify-between text-left"
                  >
                    {/* Background Typography - Vertical */}
                    <div className="absolute -bottom-8 -left-2 text-[100px] md:text-[140px] font-black text-white/[0.04] leading-none tracking-tighter select-none pointer-events-none rotate-90 origin-bottom-left">
                      TAM
                    </div>

                    <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-emerald-500/20 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="relative z-10">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-300 uppercase tracking-wider mb-6">
                        Enterprise
                      </span>

                      <h3 className="text-3xl md:text-4xl font-black tracking-tight leading-[0.95] mb-3">
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-emerald-300 to-teal-400">Market</span>
                        <br />
                        <span className="text-white/90">Size</span>
                      </h3>

                      <p className="text-xs text-gray-400 leading-relaxed">
                        TAM • SAM • SOM
                        <br />
                        <span className="text-emerald-400">Real market data</span>
                      </p>
                    </div>

                    <div className="relative z-10 flex items-center gap-2 text-emerald-300 group-hover:text-emerald-200 transition-colors">
                      {isCalculatingMarket ? (
                        <div className="w-4 h-4 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
                      ) : (
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                      )}
                    </div>
                  </button>
                ) : (
                  <button onClick={() => setShowPricingModal(true)} className="md:col-span-5 group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#061210]/80 via-[#050f0d]/80 to-[#08080c]/80 border border-white/[0.05] hover:border-emerald-500/20 transition-all duration-700 p-8 min-h-[280px] flex flex-col justify-between text-left">
                    <div className="absolute -bottom-8 -left-2 text-[100px] md:text-[140px] font-black text-white/[0.05] leading-none tracking-tighter select-none pointer-events-none rotate-90 origin-bottom-left">
                      TAM
                    </div>

                    <div className="relative z-10">
                      <LockedBadge tier="enterprise" />

                      <h3 className="text-3xl md:text-4xl font-black tracking-tight leading-[0.95] mb-3 mt-6">
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-emerald-400/80 to-teal-400/80">Market</span>
                        <br />
                        <span className="text-white/70">Size</span>
                      </h3>

                      <p className="text-xs text-gray-400 leading-relaxed">TAM • SAM • SOM</p>
                    </div>

                    <div className="relative z-10 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-semibold shadow-lg shadow-emerald-500/20 w-fit">
                      <Lock className="w-3 h-3" />
                      <span>Unlock</span>
                    </div>
                  </button>
                )}

                {/* Brand Vibe - Wide Horizontal Card (spans 6 cols) */}
                {canAccess("pro") ? (
                  <button
                    onClick={handleGenerateBrandVibe}
                    disabled={isGeneratingVibe}
                    className="md:col-span-6 group relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#120610] via-[#0f050d] to-[#0a080c] border border-white/[0.08] hover:border-pink-500/30 transition-all duration-700 p-8 min-h-[160px] flex items-center justify-between text-left"
                  >
                    {/* Background Typography */}
                    <div className="absolute top-1/2 -translate-y-1/2 -right-8 text-[80px] md:text-[100px] font-black text-white/[0.04] leading-none tracking-tighter select-none pointer-events-none">
                      VIBE
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-pink-500/5 to-rose-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10 flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-2xl md:text-3xl font-black tracking-tight">
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-rose-300">Brand Vibe</span>
                        </h3>
                        <span className="px-2 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-[9px] font-bold text-pink-300 uppercase">Pro</span>
                      </div>
                      <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">Colors • Typography • Slogan • Aesthetic</p>
                    </div>

                    <div className="relative z-10">
                      {isGeneratingVibe ? (
                        <div className="w-10 h-10 border-2 border-pink-400/30 border-t-pink-400 rounded-full animate-spin" />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:bg-pink-500/10 group-hover:border-pink-500/30 transition-all duration-300">
                          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-pink-300 group-hover:translate-x-0.5 transition-all" />
                        </div>
                      )}
                    </div>
                  </button>
                ) : (
                  <button onClick={() => setShowPricingModal(true)} className="md:col-span-6 group relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#120610]/80 via-[#0f050d]/80 to-[#0a080c]/80 border border-white/[0.05] hover:border-pink-500/20 transition-all duration-700 p-8 min-h-[160px] flex items-center justify-between text-left">
                    <div className="absolute top-1/2 -translate-y-1/2 -right-8 text-[80px] md:text-[100px] font-black text-white/[0.05] leading-none tracking-tighter select-none pointer-events-none">
                      VIBE
                    </div>

                    <div className="relative z-10 flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white/70">Brand Vibe</h3>
                        <LockedBadge tier="pro" />
                      </div>
                      <p className="text-xs text-gray-400">Colors • Typography • Slogan</p>
                    </div>

                    <div className="relative z-10 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 text-white text-xs font-semibold shadow-lg shadow-pink-500/20">
                      <Lock className="w-3 h-3" />
                      <span>Unlock</span>
                    </div>
                  </button>
                )}

                {/* Tech Stack - Wide Horizontal Card (spans 6 cols) */}
                {canAccess("pro") ? (
                  <button
                    onClick={handleRecommendTechStack}
                    disabled={isRecommendingStack}
                    className="md:col-span-6 group relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#061215] via-[#050d10] to-[#0a0a0c] border border-white/[0.08] hover:border-cyan-500/30 transition-all duration-700 p-8 min-h-[160px] flex items-center justify-between text-left"
                  >
                    {/* Background Typography */}
                    <div className="absolute top-1/2 -translate-y-1/2 -right-8 text-[80px] md:text-[100px] font-black text-white/[0.04] leading-none tracking-tighter select-none pointer-events-none">
                      STACK
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10 flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-2xl md:text-3xl font-black tracking-tight">
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">Tech Stack</span>
                        </h3>
                        <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[9px] font-bold text-cyan-300 uppercase">Pro</span>
                      </div>
                      <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">Frameworks • Tools • Architecture • Best practices</p>
                    </div>

                    <div className="relative z-10">
                      {isRecommendingStack ? (
                        <div className="w-10 h-10 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 transition-all duration-300">
                          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all" />
                        </div>
                      )}
                    </div>
                  </button>
                ) : (
                  <button onClick={() => setShowPricingModal(true)} className="md:col-span-6 group relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#061215]/80 via-[#050d10]/80 to-[#0a0a0c]/80 border border-white/[0.05] hover:border-cyan-500/20 transition-all duration-700 p-8 min-h-[160px] flex items-center justify-between text-left">
                    <div className="absolute top-1/2 -translate-y-1/2 -right-8 text-[80px] md:text-[100px] font-black text-white/[0.05] leading-none tracking-tighter select-none pointer-events-none">
                      STACK
                    </div>

                    <div className="relative z-10 flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white/70">Tech Stack</h3>
                        <LockedBadge tier="pro" />
                      </div>
                      <p className="text-xs text-gray-400">Frameworks • Tools • Architecture</p>
                    </div>

                    <div className="relative z-10 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20">
                      <Lock className="w-3 h-3" />
                      <span>Unlock</span>
                    </div>
                  </button>
                )}
              </div>
            </motion.div>

            {/* Brand Vibe Result */}
            {brandVibeResult && (
              <BrandVibe data={brandVibeResult} />
            )}

            {/* Tech Stack Result */}
            {techStack && (
              <TechStackDisplay data={techStack} />
            )}

            {/* AI Pivot Generator - Enterprise Feature */}
            {canAccess("enterprise") ? (
              <motion.div
                className="md:col-span-4 macos-card p-0 mt-6 relative overflow-hidden group bg-gradient-to-br from-indigo-900/10 via-[#0a0510] to-[#050205] border-indigo-500/20"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <div className="absolute top-0 right-0 p-32 bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />

                <div className="p-6 md:p-8 relative z-10">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                          <Sparkles className="w-4 h-4 text-indigo-300" />
                        </div>
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                          Valueshift Engine v2
                        </span>
                      </div>

                      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">
                        {pivot ? "Strategic Pivot Opportunity" : "Hit a Wall? Pivot Instantly."}
                      </h2>

                      {!pivot && (
                        <p className="text-gray-400 text-sm max-w-lg leading-relaxed">
                          Our AI analyzes 2024-25 market gaps to restructure your core idea into a high-growth venture.
                        </p>
                      )}
                    </div>

                    <div className="flex-shrink-0">
                      <button
                        onClick={handlePivot}
                        disabled={isPivoting}
                        className="liquid-button bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500/50 px-6 py-3 flex items-center gap-2 shadow-[0_0_30px_rgba(79,70,229,0.2)]"
                      >
                        <RefreshCw className={clsx("w-4 h-4", isPivoting && "animate-spin")} />
                        {isPivoting ? "Analyzing Markets..." : pivot ? "Generate New Angle" : "Generate Pivot Strategy"}
                      </button>
                    </div>
                  </div>

                  {pivot && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/5"
                    >
                      {/* 1. New Concept */}
                      <div className="md:col-span-2 space-y-3">
                        <h3 className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">The New Concept</h3>
                        <p className="text-xl md:text-2xl text-white font-medium leading-relaxed">
                          "{pivot.pivotConcept}"
                        </p>
                        <p className="text-sm text-gray-400 border-l-2 border-indigo-500/30 pl-3">
                          <span className="text-gray-500">Shift:</span> {pivot.targetAudienceShift}
                        </p>
                      </div>

                      {/* 2. Why It Works */}
                      <div className="md:col-span-1 bg-indigo-950/20 rounded-xl p-5 border border-indigo-500/10">
                        <h3 className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                          <TrendingUp className="w-3 h-3" /> Market Logic
                        </h3>
                        <p className="text-sm text-gray-300 leading-relaxed">
                          {pivot.whyItWorks}
                        </p>

                        <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                          <span className="text-[10px] text-gray-500 uppercase">Complexity</span>
                          <span className={clsx(
                            "text-xs font-bold px-2 py-0.5 rounded",
                            pivot.complexityScore === 'Low' ? "bg-green-500/10 text-green-400" :
                              pivot.complexityScore === 'Medium' ? "bg-yellow-500/10 text-yellow-400" : "bg-red-500/10 text-red-400"
                          )}>
                            {pivot.complexityScore}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                className="md:col-span-4 mt-6 relative overflow-hidden rounded-2xl"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                {/* Blurred Preview */}
                <div
                  className="macos-card p-0 bg-gradient-to-br from-indigo-900/10 via-[#0a0510] to-[#050205] border-indigo-500/20"
                  style={{ filter: 'blur(6px)' }}
                >
                  <div className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                            <Sparkles className="w-4 h-4 text-indigo-300" />
                          </div>
                          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                            Valueshift Engine v2
                          </span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">
                          Hit a Wall? Pivot Instantly.
                        </h2>
                        <p className="text-gray-400 text-sm max-w-lg leading-relaxed">
                          Our AI analyzes 2024-25 market gaps to restructure your core idea into a high-growth venture.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Locked Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 backdrop-blur-sm bg-gradient-to-b from-black/40 via-black/60 to-black/80 rounded-2xl">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30"
                  >
                    <Lock className="w-7 h-7 text-white" />
                  </motion.div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold uppercase tracking-wider mb-3 shadow-md">
                    <Crown size={12} />
                    Enterprise Feature
                  </div>

                  <h4 className="text-white text-lg font-bold text-center mb-1">
                    Unlock Pivot Strategies
                  </h4>

                  <p className="text-white/70 text-sm text-center mb-5 max-w-xs">
                    Get AI-powered pivot suggestions to transform your idea into a high-growth venture.
                  </p>

                  <button
                    onClick={() => setShowPricingModal(true)}
                    className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-sm shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 active:scale-95 transition-all duration-300"
                  >
                    <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
                    Unlock with Enterprise
                    <span className="text-white/70 text-xs ml-1">(₹99/mo)</span>
                  </button>
                </div>
              </motion.div>
            )}




          </motion.div>
        )}

        {/* Competitive Analysis Section */}
        {competitiveAnalysis && (
          <CompetitiveAnalysis data={competitiveAnalysis} />
        )}

        {/* Market Size Section */}
        {marketSize && (
          <MarketSizeCalculator data={marketSize} />
        )}

        {/* Example Ideas Section - Show when no report */}
        {!report && !isAnalyzing && (
          <>
            <ExampleIdeas onSelectIdea={handleSelectExampleIdea} />
            <IdeaSlotMachine onValidate={(generatedIdea) => {
              setIdea(generatedIdea);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} />
          </>
        )}
      </div>

      {/* Fixed Bottom Ticker */}
      <div className="fixed bottom-0 left-0 w-full z-40 pointer-events-none">
        <div className="pointer-events-auto">
          <TrendTicker />
        </div>
      </div>

      {/* Fullscreen Roadmap Modal */}
      <AnimatePresence>
        {showRoadmapModal && roadmap && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 md:p-6"
            onClick={() => setShowRoadmapModal(false)}

          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-black/40 border border-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header - Linear Style */}
              <div className="sticky top-0 bg-[#0a0a0a]/95 backdrop-blur-md p-4 md:p-8 border-b border-white/10 z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                      <Map className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">Execution Roadmap</h2>
                      <p className="text-xs md:text-sm text-gray-500">From concept to MVP in 4 weeks</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowRoadmapModal(false)}
                    className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors text-gray-400 hover:text-white"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 md:p-8 overflow-y-auto max-h-[calc(90vh-100px)]">
                <div className="space-y-0">
                  {roadmap.map((week, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="relative pl-8 md:pl-0"
                    >
                      {/* Connector Line (Desktop) */}
                      {i < roadmap.length - 1 && (
                        <div className="hidden md:block absolute left-1/2 top-full bottom-0 w-px bg-white/10 h-10 -ml-px z-0 transformed -translate-y-4" />
                      )}

                      {/* Week Card */}
                      <div className="mb-10 relative">
                        <div className="flex flex-col md:items-center gap-6 mb-6">
                          <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm font-medium text-gray-300 font-mono">
                            {week.week}
                          </span>
                          <h3 className="text-2xl md:text-4xl font-bold text-white text-center tracking-tight">
                            {week.title}
                          </h3>
                        </div>

                        <div className="bg-[#0f0f0f] rounded-xl border border-white/10 p-5 md:p-8 relative z-10">

                          {/* Tasks */}
                          <div className="space-y-3 mb-8">
                            {week.tasks.map((task: string, j: number) => (
                              <div key={j} className="flex items-start gap-3 group">
                                <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:border-white transition-colors">
                                  <div className="w-2.5 h-2.5 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <p className="text-gray-400 group-hover:text-gray-200 transition-colors leading-relaxed">
                                  {task}
                                </p>
                              </div>
                            ))}
                          </div>

                          {/* Metrics Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-white/5">
                            <div className="p-4 rounded-lg bg-white/5 border border-white/5">
                              <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 mb-1">Estimated Cost</p>
                              <p className="text-lg font-medium text-white font-mono">{week.estimatedCost}</p>
                            </div>
                            <div className="p-4 rounded-lg bg-white/5 border border-white/5">
                              <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 mb-1">Team Size</p>
                              <p className="text-lg font-medium text-white">{week.teamSize} members</p>
                            </div>
                            <div className="p-4 rounded-lg bg-white/5 border border-white/5">
                              <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 mb-2">Skills Needed</p>
                              <div className="flex flex-wrap gap-1.5">
                                {week.skillsRequired?.map((skill: string, k: number) => (
                                  <span key={k} className="text-xs px-2 py-0.5 bg-white/10 text-gray-300 rounded border border-white/5">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Milestones */}
                          {week.keyMilestones && week.keyMilestones.length > 0 && (
                            <div className="mt-4 p-4 rounded-lg border border-dashed border-white/10 bg-black/20">
                              <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 mb-3 flex items-center gap-2">
                                <Check className="w-3 h-3" /> Key Deliverables
                              </p>
                              <ul className="space-y-2">
                                {week.keyMilestones.map((milestone: string, m: number) => (
                                  <li key={m} className="text-sm text-gray-400 flex items-center gap-2">
                                    <span className="w-1 h-1 rounded-full bg-green-500/50" />
                                    {milestone}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Onboarding Tutorial */}
      <OnboardingTutorial />

      {/* Pricing Modal - Opens as overlay when locked features are clicked */}
      <PricingModal isOpen={showPricingModal} onClose={() => setShowPricingModal(false)} />
      </main>
    </BackgroundDots>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
