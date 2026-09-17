import React from 'react';
import { SectionType } from '../types';
import { EDITOR_CATEGORIES, STREAMER_CATEGORIES } from '../data/packsData';
import { 
  Sparkles, 
  Type, 
  Flame, 
  Volume2, 
  Palette, 
  Layers, 
  Video, 
  MessageSquare, 
  Zap, 
  SlidersHorizontal,
  Search
} from 'lucide-react';

interface FilterBarProps {
  currentSection: SectionType;
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  selectedSoftware: string;
  onSelectSoftware: (software: string) => void;
  sortBy: 'newest' | 'rating' | 'alphabetical';
  onSortChange: (sort: 'newest' | 'rating' | 'alphabetical') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalFilteredCount: number;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-3.5 h-3.5" />,
  Type: <Type className="w-3.5 h-3.5" />,
  Flame: <Flame className="w-3.5 h-3.5" />,
  Volume2: <Volume2 className="w-3.5 h-3.5" />,
  Palette: <Palette className="w-3.5 h-3.5" />,
  Layers: <Layers className="w-3.5 h-3.5" />,
  Video: <Video className="w-3.5 h-3.5" />,
  Zap: <Zap className="w-3.5 h-3.5" />,
  MessageSquare: <MessageSquare className="w-3.5 h-3.5" />
};

export const FilterBar: React.FC<FilterBarProps> = ({
  currentSection,
  selectedCategory,
  onSelectCategory,
  selectedSoftware,
  onSelectSoftware,
  sortBy,
  onSortChange,
  searchQuery,
  onSearchChange,
  totalFilteredCount
}) => {
  const isEditor = currentSection === 'editor';
  const categories = isEditor ? EDITOR_CATEGORIES : STREAMER_CATEGORIES;

  const softwareList = isEditor 
    ? ['همه نرم‌افزارها', 'Premiere Pro', 'After Effects', 'Photoshop', 'CapCut', 'DaVinci Resolve']
    : ['همه نرم‌افزارها', 'OBS Studio', 'Streamlabs', 'Photoshop'];

  return (
    <div id="catalog-view" className="py-4 border-b border-white/[0.08] bg-[#07080c]/90 backdrop-blur-md scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? isEditor
                      ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                      : 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/20'
                    : 'bg-[#0d1017] text-slate-300 hover:text-white hover:bg-slate-800/80 border border-white/[0.07]'
                }`}
              >
                {ICON_MAP[cat.icon]}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Second Row: Software filter & Sort & Count */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          {/* Software tags */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 text-xs">
            <span className="text-slate-400 whitespace-nowrap flex items-center gap-1 font-medium">
              <SlidersHorizontal className="w-3 h-3 text-slate-500" />
              فیلتر نرم‌افزار:
            </span>
            <div className="flex items-center gap-1">
              {softwareList.map((sw) => {
                const isSelected = selectedSoftware === (sw === 'همه نرم‌افزارها' ? 'all' : sw);
                return (
                  <button
                    key={sw}
                    onClick={() => onSelectSoftware(sw === 'همه نرم‌افزارها' ? 'all' : sw)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] transition-colors whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? 'bg-white/[0.12] text-white font-semibold border border-white/[0.15]'
                        : 'bg-[#0d1017] text-slate-400 hover:text-slate-200 border border-white/[0.06]'
                    }`}
                  >
                    {sw}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right side: Mobile Search + Sort + Count */}
          <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
            {/* Mobile Search */}
            <div className="sm:hidden flex-1 relative">
              <input
                type="text"
                placeholder="جستجو در پک‌ها..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-[#0d1017] text-xs text-white rounded-lg py-1.5 pr-8 pl-3 border border-white/[0.08] focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="hidden md:inline">مرتب‌سازی:</span>
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as any)}
                className="bg-[#0d1017] text-slate-200 text-xs rounded-lg px-2.5 py-1.5 border border-white/[0.08] focus:border-cyan-500 focus:outline-none cursor-pointer"
              >
                <option value="newest">⚡ جدیدترین</option>
                <option value="rating">⭐ بالاترین امتیاز</option>
                <option value="alphabetical">🔤 حروف الفبا</option>
              </select>
            </div>

            {/* Total Results */}
            <div className="text-xs text-slate-400 bg-[#0d1017] px-3 py-1 rounded-lg border border-white/[0.08] whitespace-nowrap">
              <span className="text-cyan-400 font-bold">{totalFilteredCount}</span> پک
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
