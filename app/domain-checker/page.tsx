"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { Search, Globe, X, Filter, Loader2, ArrowRight, Tag } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import BackgroundDots from "../components/BackgroundDots";
import { checkDomainAvailability } from "../actions";

interface DomainResult {
  domain: string;
  tld: string;
  available: boolean;
  price: number;
  originalPrice: number;
  currency: string;
  provider: {
    name: string;
    logo: string;
    url: string;
    color: string;
  };
  term: string;
  dealTag?: string;
  taken?: boolean;
}

type SortOption = 'popular' | 'price_low' | 'price_high';

export default function DomainChecker() {
  const { theme } = useTheme();
  const [query, setQuery] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState<DomainResult[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [activeTldFilter, setActiveTldFilter] = useState<string>('all');

  const registrars = [
    {
      name: "GoDaddy",
      url: "https://in.godaddy.com/domainsearch/find?checkAvail=1&domainToCheck=",
      color: "bg-[#1BDBDB] text-black", // GoDaddy Teal
      logo: "GD"
    },
    {
      name: "Hostinger",
      url: "https://www.hostinger.in/domain-name-search?domain=",
      color: "bg-[#673DE6] text-white", // Hostinger Purple
      logo: "H"
    },
    {
      name: "BigRock",
      url: "https://www.bigrock.in/domain-registration/index.php?domain=",
      color: "bg-[#2B4162] text-white",
      logo: "BR"
    }
  ];

  // Realistic pricing data for India (in INR)
  const tldPricing = {
    '.com': { min: 499, max: 1199, deal: 1, original: 1199 },
    '.in': { min: 149, max: 699, deal: 1, original: 699 },
    '.co.in': { min: 99, max: 499, deal: 99, original: 599 },
    '.org': { min: 799, max: 1299, deal: 749, original: 1299 },
    '.io': { min: 2999, max: 4500, deal: 2999, original: 4500 },
    '.ai': { min: 5999, max: 8000, deal: 5999, original: 8000 },
    '.xyz': { min: 99, max: 299, deal: 99, original: 299 },
    '.store': { min: 49, max: 2999, deal: 49, original: 2999 },
    '.tech': { min: 199, max: 3500, deal: 149, original: 3500 },
    '.me': { min: 299, max: 1599, deal: 299, original: 1599 },
  };

  const checkDomains = async () => {
    if (!query.trim()) return;
    
    setIsChecking(true);
    setResults([]);

    try {
      const sanitizedQuery = query.toLowerCase().replace(/[^a-z0-9-]/g, '');
      
      const generatedResults = await Promise.all(Object.entries(tldPricing).map(async ([tld, pricing]) => {
        const domain = sanitizedQuery + tld;
        
        // REAL LOOKUP: Check availability using server action (Whois)
        let isAvailable = false;
        try {
            isAvailable = await checkDomainAvailability(domain);
        } catch (e) {
            console.error(`Availability check failed for ${domain}`, e);
            isAvailable = false;
        }

        const isTaken = !isAvailable;
        const registrar = registrars[Math.floor(Math.random() * registrars.length)];
        
        let price = pricing.max;
        let originalPrice = pricing.original;
        let dealTag = undefined;

        if (isAvailable) {
            // Apply deals logic
            const hasDeal = Math.random() > 0.4;
            if (hasDeal) {
                if (registrar.name === "GoDaddy" && (tld === '.com' || tld === '.in')) {
                    price = 1; // The classic "1 rupee" deal
                    originalPrice = pricing.original;
                    dealTag = "1st Year Deal";
                } else {
                    price = pricing.deal;
                    originalPrice = pricing.original;
                    dealTag = Math.floor(((originalPrice - price) / originalPrice) * 100) + "% OFF";
                }
            }
        }

        return {
          domain,
          tld,
          available: isAvailable,
          taken: isTaken,
          price: isTaken ? 0 : price,
          originalPrice: isTaken ? 0 : originalPrice,
          currency: "₹",
          provider: registrar,
          term: "1st yr",
          dealTag
        };
      }));

      setResults(generatedResults);
    } catch (error) {
      console.error("Domain check failed", error);
    } finally {
      setIsChecking(false);
    }
  };

  const sortedResults = [...results].filter(r => {
    if (activeTldFilter === 'all') return true;
    return r.tld === activeTldFilter;
  }).sort((a, b) => {
    if (!a.available && b.available) return 1;
    if (a.available && !b.available) return -1;
    
    if (sortBy === 'price_low') return a.price - b.price;
    if (sortBy === 'price_high') return b.price - a.price;
    // Popular: prioritize .com, .in, .ai
    const importance = { '.com': 1, '.in': 2, '.ai': 3, '.io': 4 };
    const scoreA = importance[a.tld as keyof typeof importance] || 10;
    const scoreB = importance[b.tld as keyof typeof importance] || 10;
    return scoreA - scoreB;
  });

  const availableCount = results.filter(r => r.available).length;

  return (
    <BackgroundDots>
      <main className="min-h-screen flex flex-col items-center justify-start p-4 md:p-6 pt-32 md:pt-40 relative pb-24 font-sans selection:bg-blue-500/30">
      
      <div className="max-w-5xl w-full z-10 transition-all duration-700 ease-[0.16,1,0.3,1] flex flex-col items-center">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6 shadow-lg">
            <Globe className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-semibold text-gray-300 tracking-wide uppercase">
              Global Domain Search
            </span>
          </div>
          
          <h1 className={clsx(
            "text-4xl md:text-6xl font-bold tracking-tight leading-tight",
            theme === "light" ? "text-gray-900" : "text-white"
          )}>
            Claim Your Digital
            <span className={clsx(
              "block text-transparent bg-clip-text bg-gradient-to-r mt-2",
              theme === "light" ? 
                "from-indigo-600 via-purple-600 to-pink-600" :
                "from-indigo-400 via-purple-400 to-pink-400"
            )}>
              Identity Today
            </span>
          </h1>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className={clsx(
            "w-full max-w-3xl p-2 rounded-[2rem] border transition-all duration-300 relative group mb-12",
            theme === "light" ?
              "bg-white border-gray-200 shadow-[0_8px_40px_rgba(0,0,0,0.08)]" :
              "bg-white/5 border-white/10 shadow-[0_0_50px_rgba(100,0,255,0.05)]"
          )}
        >
            <div className="relative flex items-center">
                <div className="pl-6 text-gray-400">
                    <Search className="w-6 h-6" />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && checkDomains()}
                    placeholder="Type your dream domain (e.g. startupx)"
                    className={clsx(
                    "w-full px-4 py-5 rounded-2xl bg-transparent border-none focus:ring-0 text-lg md:text-xl font-medium outline-none placeholder:font-normal",
                    theme === "light" ? "text-gray-900 placeholder-gray-400" : "text-white placeholder-gray-500"
                    )}
                />
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={checkDomains}
                    disabled={isChecking || !query.trim()}
                    className={clsx(
                    "m-2 px-8 py-4 rounded-[1.5rem] font-bold text-lg transition-all duration-200 flex items-center gap-2 shadow-lg",
                    theme === "light" ?
                        "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-200" :
                        "bg-white text-black hover:bg-gray-100"
                    )}
                >
                    {isChecking ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        "Search"
                    )}
                </motion.button>
            </div>
            
        </motion.div>

        {/* Filters & Results */}
        {(results.length > 0 || isChecking) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-5xl space-y-6"
          >
            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-2">
                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
                    <span className={clsx("text-sm font-medium mr-2", theme === "light" ? "text-gray-500" : "text-gray-400")}>
                        {availableCount} Available
                    </span>
                    {['all', '.com', '.in', '.ai', '.io'].map((tld) => (
                        <button
                            key={tld}
                            onClick={() => setActiveTldFilter(tld)}
                            className={clsx(
                                "px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                                activeTldFilter === tld ? 
                                    (theme === "light" ? "bg-gray-900 text-white" : "bg-white text-black") :
                                    (theme === "light" ? "bg-gray-100 text-gray-600 hover:bg-gray-200" : "bg-white/10 text-gray-300 hover:bg-white/20")
                            )}
                        >
                            {tld === 'all' ? 'All TLDs' : tld}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className={clsx(
                            "px-4 py-2 rounded-lg text-sm font-medium outline-none cursor-pointer appearance-none pr-8 relative",
                            theme === "light" ? "bg-white border border-gray-200 text-gray-900" : "bg-white/5 border border-white/10 text-white"
                        )}
                        style={{ backgroundImage: 'none' }}
                    >
                        <option value="popular">Popularity</option>
                        <option value="price_low">Price: Low to High</option>
                        <option value="price_high">Price: High to Low</option>
                    </select>
                </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 gap-4">
              <AnimatePresence>
                {sortedResults.map((result, index) => (
                    <motion.div
                      layout
                      key={result.domain}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      className={clsx(
                        "relative flex flex-col md:flex-row items-center justify-between p-6 rounded-3xl border backdrop-blur-3xl transition-all duration-300 group",
                        result.available ? 
                            (theme === "light" ? 
                                "bg-white/80 border-white shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-200" : 
                                "bg-gray-900/40 border-white/5 hover:bg-gray-900/60 hover:border-white/20 hover:shadow-[0_0_30px_rgba(100,0,255,0.08)]"
                            ) :
                            (theme === "light" ? "bg-gray-50 border-gray-200 opacity-70 grayscale" : "bg-black/20 border-white/5 opacity-50")
                      )}
                    >
                        {/* Left: Domain Info */}
                        <div className="flex items-center gap-5 w-full md:w-auto mb-4 md:mb-0">
                            <div className={clsx(
                                "w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold shadow-inner shrink-0",
                                result.available ? 
                                    (theme === "light" ? "bg-gradient-to-br from-indigo-50 to-white text-indigo-600" : "bg-white/10 text-white") :
                                    "bg-transparent text-gray-400 border border-current"
                            )}>
                                {result.tld}
                            </div>
                            <div className="text-left">
                                <h3 className={clsx(
                                    "text-xl md:text-2xl font-bold tracking-tight flex items-center gap-2",
                                    theme === "light" ? "text-gray-900" : "text-white",
                                    !result.available && "line-through decoration-red-500/50 decoration-2"
                                )}>
                                    {result.domain.split(result.tld)[0]}
                                    <span className="opacity-50">{result.tld}</span>
                                </h3>
                                
                                {result.available ? (
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={clsx(
                                            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wide",
                                            result.provider.color
                                        )}>
                                            {result.provider.name}
                                        </span>
                                        {result.dealTag && (
                                            <span className="inline-flex items-center gap-1 text-xs font-medium text-green-500">
                                                <Tag className="w-3 h-3" />
                                                {result.dealTag}
                                            </span>
                                        )}
                                    </div>
                                ) : (
                                    <span className="text-red-500 text-sm font-medium flex items-center gap-1 mt-1">
                                        <X className="w-3 h-3" /> Taken
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Right: Pricing & Action */}
                        {result.available && (
                            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                                <div className="text-right">
                                    <div className="flex items-baseline justify-end gap-2">
                                        <span className="text-sm text-gray-400 line-through font-medium">
                                            {result.currency}{result.originalPrice}
                                        </span>
                                        <span className={clsx(
                                            "text-2xl font-black",
                                            theme === "light" ? "text-gray-900" : "text-white"
                                        )}>
                                            {result.currency}{result.price}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 font-medium">
                                        for the {result.term} • then {result.currency}{result.originalPrice}/yr
                                    </p>
                                </div>

                                <motion.a
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    href={result.provider.url + result.domain}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={clsx(
                                        "px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg min-w-[140px] justify-center",
                                        theme === "light" ? 
                                            "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200" : 
                                            "bg-white text-black hover:bg-gray-100"
                                    )}
                                >
                                    Register
                                    <ArrowRight className="w-4 h-4" />
                                </motion.a>
                            </div>
                        )}
                        
                        {!result.available && (
                             <div className="w-full md:w-auto flex justify-end">
                                <button disabled className="px-6 py-3 rounded-xl font-medium text-sm text-gray-400 bg-gray-100/5 cursor-not-allowed">
                                    Unavailable
                                </button>
                             </div>
                        )}
                    </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </div>
      </main>
    </BackgroundDots>
  );
}