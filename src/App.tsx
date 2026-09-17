import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SectionType, PackItem, GitHubConfig } from './types';
import { DEFAULT_GITHUB_CONFIG } from './data/packsData';
import { fetchPacksFromGitHub } from './services/githubService';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FilterBar } from './components/FilterBar';
import { PackCard } from './components/PackCard';
import { PackDetailModal } from './components/PackDetailModal';
import { FontTesterModal } from './components/FontTesterModal';
import { WebcamFrameTesterModal } from './components/WebcamFrameTesterModal';
import { BookmarksDrawer } from './components/BookmarksDrawer';
import { Footer } from './components/Footer';
import { 
  SearchX, 
  RefreshCw, 
  Check, 
  ExternalLink,
  PackageOpen
} from 'lucide-react';

export default function App() {
  // Main States
  const [currentSection, setCurrentSection] = useState<SectionType>('editor');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSoftware, setSelectedSoftware] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'rating' | 'alphabetical'>('newest');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Live packs from GitHub
  const [packs, setPacks] = useState<PackItem[]>(() => {
    const cached = localStorage.getItem('vidox_github_live_packs');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // ignore
      }
    }
    return [];
  });
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // GitHub Config
  const githubConfig: GitHubConfig = DEFAULT_GITHUB_CONFIG;

  // Bookmarks
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('vidox_bookmarks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  // Modals state
  const [selectedPackForDetail, setSelectedPackForDetail] = useState<PackItem | null>(null);
  const [isFontTesterOpen, setIsFontTesterOpen] = useState(false);
  const [fontTesterText, setFontTesterText] = useState('راز ساخت تامبنیل‌های ۱ میلیونی در یوتیوب!');
  const [isFrameTesterOpen, setIsFrameTesterOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  // Sync with GitHub repository
  const syncWithGitHub = useCallback(async (isManual = false) => {
    setIsSyncing(true);
    try {
      const result = await fetchPacksFromGitHub();
      setPacks(result.packs);
      if (isManual) {
        if (result.packs.length > 0) {
          showToast(`مخزن بررسی شد: ${result.packs.length} پک فعال بارگذاری شد.`);
        } else {
          showToast('مخزن متصل است. هنوز پکی در پوشه packs یافت نشد.');
        }
      }
    } catch (err) {
      if (isManual) showToast('خطا در ارتباط با سرور گیت‌هاب.');
    } finally {
      setIsSyncing(false);
    }
  }, [showToast]);

  // Initial fetch on load
  useEffect(() => {
    syncWithGitHub(false);
  }, [syncWithGitHub]);

  // Toggle Bookmark
  const handleToggleBookmark = (packId: string) => {
    setBookmarkedIds((prev) => {
      const next = prev.includes(packId) ? prev.filter((id) => id !== packId) : [...prev, packId];
      localStorage.setItem('vidox_bookmarks', JSON.stringify(next));
      return next;
    });
  };

  const handleClearBookmarks = () => {
    setBookmarkedIds([]);
    localStorage.removeItem('vidox_bookmarks');
  };

  // Direct Download Trigger
  const handleDownloadPack = (pack: PackItem) => {
    const url = pack.directDownloadUrl || 
      `https://github.com/${githubConfig.username}/${githubConfig.repository}/releases/download/${pack.githubTag}/${pack.githubFilename}`;
    
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.download = pack.githubFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    showToast(`در حال دریافت: ${pack.title}`);
  };

  // Reset filter when switching section
  const handleSectionChange = (sec: SectionType) => {
    setCurrentSection(sec);
    setSelectedCategory('all');
    setSelectedSoftware('all');
  };

  // Filtered & Sorted Packs
  const filteredPacks = useMemo(() => {
    return packs
      .filter((pack) => {
        // Section match
        if (pack.section !== currentSection) return false;

        // Category match
        if (selectedCategory !== 'all' && pack.category !== selectedCategory) {
          return false;
        }

        // Software match
        if (selectedSoftware !== 'all') {
          const hasSoftware = pack.software.some(
            (s) => s.toLowerCase().includes(selectedSoftware.toLowerCase())
          );
          if (!hasSoftware) return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesTitle = pack.title.toLowerCase().includes(q);
          const matchesTitleEn = pack.titleEn.toLowerCase().includes(q);
          const matchesDesc = pack.description.toLowerCase().includes(q);
          const matchesTag = pack.tags.some((t) => t.toLowerCase().includes(q));
          const matchesCategory = pack.categoryFa.toLowerCase().includes(q);
          return matchesTitle || matchesTitleEn || matchesDesc || matchesTag || matchesCategory;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'alphabetical') return a.title.localeCompare(b.title, 'fa');
        // newest default
        return b.id.localeCompare(a.id);
      });
  }, [packs, currentSection, selectedCategory, selectedSoftware, searchQuery, sortBy]);

  // Bookmarked Pack objects
  const bookmarkedPacks = useMemo(() => {
    return packs.filter((p) => bookmarkedIds.includes(p.id));
  }, [packs, bookmarkedIds]);

  // Keyboard shortcut listener for '/' search hotkey
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && (e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput) searchInput.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#07080c] text-slate-100 font-body flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200 antialiased">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-3.5 px-5 rounded-2xl bg-[#0e111a]/95 border border-cyan-500/40 text-cyan-300 text-xs sm:text-sm font-semibold shadow-2xl flex items-center gap-2.5 backdrop-blur-xl animate-fadeIn">
          <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modern Client Navbar */}
      <Navbar
        currentSection={currentSection}
        onSectionChange={handleSectionChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenFontTester={() => {
          setFontTesterText('راز ساخت تامبنیل‌های ۱ میلیونی در یوتیوب!');
          setIsFontTesterOpen(true);
        }}
        onOpenFrameTester={() => setIsFrameTesterOpen(true)}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        bookmarksCount={bookmarkedIds.length}
        githubRepoName={`${githubConfig.username}/${githubConfig.repository}`}
        isSyncing={isSyncing}
        onSyncGitHub={() => syncWithGitHub(true)}
      />

      {/* Hero Studio Banner */}
      <HeroSection
        currentSection={currentSection}
        totalPacksCount={packs.filter(p => p.section === currentSection).length}
        onOpenFontTester={() => {
          setFontTesterText('راز ساخت تامبنیل‌های ۱ میلیونی در یوتیوب!');
          setIsFontTesterOpen(true);
        }}
        onOpenFrameTester={() => setIsFrameTesterOpen(true)}
        isSyncing={isSyncing}
        onSyncGitHub={() => syncWithGitHub(true)}
      />

      {/* Filtering & Software Chips Bar */}
      <FilterBar
        currentSection={currentSection}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedSoftware={selectedSoftware}
        onSelectSoftware={setSelectedSoftware}
        sortBy={sortBy}
        onSortChange={setSortBy}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalFilteredCount={filteredPacks.length}
      />

      {/* Main Catalog View */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Section title header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className={`w-2.5 h-7 rounded-full ${
              currentSection === 'editor' ? 'bg-cyan-500' : 'bg-purple-600'
            }`} />
            <div>
              <h2 className="font-display text-xl sm:text-2xl text-white font-bold">
                {currentSection === 'editor' ? 'کاتالوگ پک‌های تدوین' : 'کاتالوگ پک‌های استریم و OBS'}
              </h2>
              <span className="text-xs text-slate-400">
                {filteredPacks.length} پک فعال و تست‌شده
              </span>
            </div>
          </div>

          <a
            href={`https://github.com/${githubConfig.username}/${githubConfig.repository}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] transition-colors w-fit"
          >
            <span className="dir-ltr font-mono text-[11px]">{githubConfig.username}/{githubConfig.repository}</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>
        </div>

        {/* Empty State when no packs found */}
        {filteredPacks.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center p-6 rounded-3xl bg-[#090b11] border border-white/[0.08] space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-500">
              {searchQuery || selectedCategory !== 'all' ? (
                <SearchX className="w-8 h-8 text-slate-400" />
              ) : (
                <PackageOpen className="w-8 h-8 text-cyan-400" />
              )}
            </div>
            
            <h3 className="font-display text-xl text-white font-bold">
              {searchQuery || selectedCategory !== 'all' 
                ? 'پکی با این فیلتر یا نام پیدا نشد' 
                : 'در حال حاضر پکی در این بخش قرار ندارد'}
            </h3>
            
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              {searchQuery || selectedCategory !== 'all'
                ? 'فیلترهای انتخابی یا جستجو را پاک کنید تا تمامی پک‌ها نمایش داده شوند.'
                : 'برای بررسی آخرین فایل‌های اضافه شده به مخزن، روی دکمه بررسی مجدد کلیک کنید.'}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => syncWithGitHub(true)}
                disabled={isSyncing}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-cyan-500/20 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>بررسی مجدد مخزن</span>
              </button>

              {(searchQuery || selectedCategory !== 'all' || selectedSoftware !== 'all') && (
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedSoftware('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                >
                  حذف فیلترها
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Animated Cards Grid */
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredPacks.map((pack) => (
                <PackCard
                  key={pack.id}
                  pack={pack}
                  onOpenDetail={(p) => setSelectedPackForDetail(p)}
                  isBookmarked={bookmarkedIds.includes(pack.id)}
                  onToggleBookmark={handleToggleBookmark}
                  githubConfig={githubConfig}
                  onDownloadClick={handleDownloadPack}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      {/* Modals */}
      {/* 1. Pack Detail Modal */}
      <PackDetailModal
        pack={selectedPackForDetail}
        onClose={() => setSelectedPackForDetail(null)}
        githubConfig={githubConfig}
        onOpenFontTester={(sampleText) => {
          if (sampleText) setFontTesterText(sampleText);
          setIsFontTesterOpen(true);
        }}
        onOpenFrameTester={() => setIsFrameTesterOpen(true)}
      />

      {/* 2. Live Font Tester Modal */}
      <FontTesterModal
        isOpen={isFontTesterOpen}
        onClose={() => setIsFontTesterOpen(false)}
        onDownloadFontPack={() => {
          const fontPack = packs.find((p) => p.category === 'fonts');
          if (fontPack) handleDownloadPack(fontPack);
        }}
        initialText={fontTesterText}
      />

      {/* 3. Live Webcam Frame Tester Modal */}
      <WebcamFrameTesterModal
        isOpen={isFrameTesterOpen}
        onClose={() => setIsFrameTesterOpen(false)}
        onDownloadStreamPack={() => {
          const framePack = packs.find((p) => p.category === 'webcam-frames');
          if (framePack) handleDownloadPack(framePack);
        }}
      />

      {/* 4. Bookmarks Drawer */}
      <BookmarksDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarkedPacks={bookmarkedPacks}
        onRemoveBookmark={handleToggleBookmark}
        onClearAll={handleClearBookmarks}
        onOpenDetail={(p) => {
          setIsBookmarksOpen(false);
          setSelectedPackForDetail(p);
        }}
        onDownloadPack={handleDownloadPack}
      />

      {/* Footer */}
      <Footer
        onSectionChange={handleSectionChange}
        onOpenFontTester={() => setIsFontTesterOpen(true)}
        onOpenFrameTester={() => setIsFrameTesterOpen(true)}
        githubConfig={githubConfig}
      />
    </div>
  );
}
