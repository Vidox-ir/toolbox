import React from 'react';
import { motion } from 'motion/react';
import { PackItem, GitHubConfig } from '../types';
import { 
  Download, 
  Eye, 
  Bookmark, 
  Star, 
  HardDrive, 
  Layers, 
  CheckCircle2
} from 'lucide-react';

interface PackCardProps {
  pack: PackItem;
  onOpenDetail: (pack: PackItem) => void;
  isBookmarked: boolean;
  onToggleBookmark: (packId: string) => void;
  githubConfig: GitHubConfig;
  onDownloadClick: (pack: PackItem) => void;
}

export const PackCard: React.FC<PackCardProps> = ({
  pack,
  onOpenDetail,
  isBookmarked,
  onToggleBookmark,
  onDownloadClick
}) => {
  const isEditor = pack.section === 'editor';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group relative flex flex-col bg-[#0b0e16] rounded-2xl border border-white/[0.08] hover:border-white/[0.18] transition-all duration-300 hover:shadow-2xl hover:shadow-black/80 overflow-hidden text-right"
    >
      {/* Top accent hover glow */}
      <div 
        className={`absolute top-0 inset-x-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 ${
          isEditor 
            ? 'bg-gradient-to-r from-transparent via-cyan-400 to-transparent' 
            : 'bg-gradient-to-r from-transparent via-purple-500 to-transparent'
        }`}
      />

      {/* Thumbnail */}
      <div 
        onClick={() => onOpenDetail(pack)}
        className="relative aspect-video w-full overflow-hidden bg-black/80 cursor-pointer"
      >
        <img
          src={pack.thumbnail}
          alt={pack.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e16] via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 right-3 left-3 flex items-center justify-between pointer-events-none">
          {pack.badge ? (
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-md shadow-md pointer-events-auto ${
              isEditor 
                ? 'bg-cyan-500 text-black' 
                : 'bg-purple-600 text-white'
            }`}>
              {pack.badge}
            </span>
          ) : (
            <span className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-black/75 text-slate-200 border border-white/10 backdrop-blur-md">
              {pack.categoryFa}
            </span>
          )}

          {/* Bookmark */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(pack.id);
            }}
            className={`p-2 rounded-xl backdrop-blur-md transition-all pointer-events-auto cursor-pointer ${
              isBookmarked
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30'
                : 'bg-black/60 text-slate-300 hover:text-white hover:bg-black/90 border border-white/10'
            }`}
            title={isBookmarked ? 'حذف از نشان‌شده‌ها' : 'نشان کردن این پک'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bottom items count & formats */}
        <div className="absolute bottom-2.5 right-3 left-3 flex items-center justify-between text-[11px] pointer-events-none">
          <span className="bg-black/80 px-2 py-0.5 rounded-md backdrop-blur-sm border border-white/10 flex items-center gap-1 font-medium text-slate-200">
            <Layers className="w-3 h-3 text-cyan-400" />
            {pack.itemsCount}
          </span>
          <span className="bg-black/80 px-2 py-0.5 rounded-md backdrop-blur-sm border border-white/10 text-slate-300 font-mono text-[10px] dir-ltr">
            {pack.format.slice(0, 2).join(' • ')}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header Row: English Code & Rating */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5 font-mono">
            <span className="dir-ltr truncate max-w-[200px] text-slate-400">{pack.titleEn}</span>
            <span className="text-amber-400 flex items-center gap-1 font-bold">
              <Star className="w-3 h-3 fill-amber-400" />
              {pack.rating}
            </span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onOpenDetail(pack)}
            className="font-display text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 cursor-pointer mb-2 leading-snug"
          >
            {pack.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
            {pack.description}
          </p>

          {/* Software tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {pack.software.slice(0, 3).map((sw) => (
              <span
                key={sw}
                className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-300 border border-white/[0.06] font-medium"
              >
                {sw}
              </span>
            ))}
            {pack.software.length > 3 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/[0.04] text-slate-500 font-mono">
                +{pack.software.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Footer specs & Actions */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 py-2.5 border-t border-white/[0.06] mb-3">
            <span className="flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-slate-500" />
              حجم: <strong className="text-slate-200 font-medium">{pack.fileSize}</strong>
            </span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              تست‌شده و آماده
            </span>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onOpenDetail(pack)}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/[0.08] transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>جزییات پک</span>
            </button>

            <button
              onClick={() => onDownloadClick(pack)}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
                isEditor
                  ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-500/20'
                  : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/20'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>دانلود رایگان</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
