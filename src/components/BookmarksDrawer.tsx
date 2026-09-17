import React from 'react';
import { PackItem, GitHubConfig } from '../types';
import { 
  X, 
  Bookmark, 
  Trash2, 
  Download, 
  Eye, 
  HardDrive, 
  Sparkles 
} from 'lucide-react';

interface BookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarkedPacks: PackItem[];
  onRemoveBookmark: (id: string) => void;
  onClearAll: () => void;
  onOpenDetail: (pack: PackItem) => void;
  onDownloadPack: (pack: PackItem) => void;
}

export const BookmarksDrawer: React.FC<BookmarksDrawerProps> = ({
  isOpen,
  onClose,
  bookmarkedPacks,
  onRemoveBookmark,
  onClearAll,
  onOpenDetail,
  onDownloadPack
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 left-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-[#090d16] border-r border-slate-800 shadow-2xl flex flex-col text-right">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Bookmark className="w-4 h-4 fill-cyan-400" />
              </div>
              <div>
                <h3 className="font-display text-lg text-white">پک‌های نشان‌شده شما</h3>
                <span className="text-xs text-slate-400">{bookmarkedPacks.length} پک ذخیره شده برای دانلود</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {bookmarkedPacks.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600">
                  <Bookmark className="w-8 h-8" />
                </div>
                <h4 className="font-display text-base text-slate-300">هنوز پکی را ذخیره نکرده‌اید</h4>
                <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                  برای دانلود سریع‌تر در آینده، با زدن آیکون بوکمارک روی هر پک آن را در این بخش ذخیره کنید.
                </p>
              </div>
            ) : (
              bookmarkedPacks.map((pack) => (
                <div
                  key={pack.id}
                  className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all flex gap-3"
                >
                  <img
                    src={pack.thumbnail}
                    alt={pack.title}
                    className="w-20 h-20 rounded-xl object-cover flex-shrink-0 bg-black"
                  />
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                        <span className="text-cyan-400 font-semibold">{pack.categoryFa}</span>
                        <span className="flex items-center gap-1 font-mono">
                          <HardDrive className="w-2.5 h-2.5" />
                          {pack.fileSize}
                        </span>
                      </div>
                      <h5 
                        onClick={() => {
                          onClose();
                          onOpenDetail(pack);
                        }}
                        className="text-xs font-bold text-white line-clamp-1 hover:text-cyan-300 cursor-pointer"
                      >
                        {pack.title}
                      </h5>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onDownloadPack(pack)}
                          className="px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Download className="w-3 h-3" />
                          <span>دانلود</span>
                        </button>
                        <button
                          onClick={() => {
                            onClose();
                            onOpenDetail(pack);
                          }}
                          className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                          title="مشاهده جزییات"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveBookmark(pack.id)}
                        className="p-1 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                        title="حذف از نشان‌شده‌ها"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {bookmarkedPacks.length > 0 && (
            <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
              <button
                onClick={onClearAll}
                className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>پاکسازی همه</span>
              </button>

              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 cursor-pointer"
              >
                بستن منو
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
