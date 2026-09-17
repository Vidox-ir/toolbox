import React from 'react';
import { motion } from 'motion/react';
import { SectionType } from '../types';
import { 
  Clapperboard, 
  Gamepad2, 
  Search, 
  Github, 
  Type, 
  Video, 
  Bookmark,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';

interface NavbarProps {
  currentSection: SectionType;
  onSectionChange: (section: SectionType) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenFontTester: () => void;
  onOpenFrameTester: () => void;
  onOpenBookmarks: () => void;
  bookmarksCount: number;
  githubRepoName: string;
  isSyncing: boolean;
  onSyncGitHub: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentSection,
  onSectionChange,
  searchQuery,
  onSearchChange,
  onOpenFontTester,
  onOpenFrameTester,
  onOpenBookmarks,
  bookmarksCount,
  githubRepoName,
  isSyncing,
  onSyncGitHub
}) => {
  const isEditor = currentSection === 'editor';

  return (
    <header className="sticky top-0 z-40 w-full bg-[#07080c]/90 backdrop-blur-xl border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo & Studio Tabs */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 cursor-pointer select-none">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-[1.5px] shadow-lg shadow-cyan-500/15">
              <div className="w-full h-full bg-[#0a0c12] rounded-[10px] flex items-center justify-center">
                <span className="font-display text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-300">
                  VX
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-display text-xl font-bold tracking-tight text-white">
                  جعبه ابزار ویدوکس
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/[0.06] text-cyan-400 border border-white/[0.08]">
                  v2.0
                </span>
              </div>
            </div>
          </div>

          {/* Section Switcher Tabs */}
          <div className="hidden md:flex items-center bg-[#0d0f17] p-1 rounded-xl border border-white/[0.08] relative">
            <button
              onClick={() => onSectionChange('editor')}
              className={`relative z-10 flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                isEditor ? 'text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              {isEditor && (
                <motion.div
                  layoutId="activeNavTab"
                  className="absolute inset-0 bg-cyan-400 rounded-lg shadow-md shadow-cyan-400/20"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}
              <Clapperboard className="w-3.5 h-3.5 relative z-10" />
              <span className="relative z-10">ادیتورهای ویدیو</span>
            </button>

            <button
              onClick={() => onSectionChange('streamer')}
              className={`relative z-10 flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                !isEditor ? 'text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {!isEditor && (
                <motion.div
                  layoutId="activeNavTab"
                  className="absolute inset-0 bg-purple-600 rounded-lg shadow-md shadow-purple-600/20"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}
              <Gamepad2 className="w-3.5 h-3.5 relative z-10" />
              <span className="relative z-10">استریمرها و OBS</span>
            </button>
          </div>
        </div>

        {/* Center Search Input */}
        <div className="flex-1 max-w-xs hidden lg:block">
          <div className="relative">
            <input
              type="text"
              placeholder="جستجو در بین پک‌ها..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-[#0d1017] text-xs text-slate-200 placeholder:text-slate-500 rounded-xl py-2 pr-9 pl-8 border border-white/[0.08] focus:border-cyan-500/50 focus:bg-[#111520] focus:outline-none transition-all"
            />
            <Search className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
            <kbd className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 bg-white/[0.05] border border-white/[0.08] px-1 py-0.5 rounded font-mono">
              /
            </kbd>
          </div>
        </div>

        {/* Action Tools */}
        <div className="flex items-center gap-2">
          {/* Sync with GitHub Button */}
          <button
            onClick={onSyncGitHub}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[#0e111a] hover:bg-slate-800/80 text-slate-300 hover:text-white border border-white/[0.08] transition-all cursor-pointer disabled:opacity-50"
            title="بررسی و دریافت آخرین تغییرات از گیت‌هاب"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isSyncing ? 'در حال همگام‌سازی...' : 'بروزرسانی'}</span>
          </button>

          {/* Quick tester shortcut */}
          {isEditor ? (
            <button
              onClick={onOpenFontTester}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-cyan-300 border border-white/[0.08] transition-colors cursor-pointer"
            >
              <Type className="w-3.5 h-3.5 text-cyan-400" />
              <span>تستر فونت</span>
            </button>
          ) : (
            <button
              onClick={onOpenFrameTester}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-purple-300 border border-white/[0.08] transition-colors cursor-pointer"
            >
              <Video className="w-3.5 h-3.5 text-purple-400" />
              <span>شبیه‌ساز وبکم</span>
            </button>
          )}

          {/* Bookmarks Drawer button */}
          <button
            onClick={onOpenBookmarks}
            className="relative p-2 rounded-xl bg-[#0e111a] hover:bg-slate-800/80 text-slate-300 hover:text-white border border-white/[0.08] transition-colors cursor-pointer"
            title="پک‌های نشان‌شده"
          >
            <Bookmark className="w-4 h-4" />
            {bookmarksCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-400 text-black text-[10px] font-bold flex items-center justify-center">
                {bookmarksCount}
              </span>
            )}
          </button>

          {/* GitHub Repo link */}
          <a
            href={`https://github.com/${githubRepoName}`}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-xl bg-[#0e111a] hover:bg-slate-800/80 text-slate-300 hover:text-white border border-white/[0.08] transition-colors"
            title="مشاهده مخزن رسمی در گیت‌هاب"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Mobile Section Switcher */}
      <div className="md:hidden px-4 pb-2.5 flex items-center gap-2">
        <button
          onClick={() => onSectionChange('editor')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            isEditor
              ? 'bg-cyan-500 text-black font-bold shadow-sm'
              : 'bg-[#0d1017] text-slate-400 border border-white/[0.06]'
          }`}
        >
          <Clapperboard className="w-3.5 h-3.5" />
          <span>ادیتورهای ویدیو</span>
        </button>
        <button
          onClick={() => onSectionChange('streamer')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            !isEditor
              ? 'bg-purple-600 text-white font-bold shadow-sm'
              : 'bg-[#0d1017] text-slate-400 border border-white/[0.06]'
          }`}
        >
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>استریمرها و OBS</span>
        </button>
      </div>
    </header>
  );
};
