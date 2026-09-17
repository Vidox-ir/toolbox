import React from 'react';
import { SectionType } from '../types';
import { 
  Type, 
  Video, 
  ArrowDown,
  Sparkles,
  Layers,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

interface HeroSectionProps {
  currentSection: SectionType;
  totalPacksCount: number;
  onOpenFontTester: () => void;
  onOpenFrameTester: () => void;
  isSyncing: boolean;
  onSyncGitHub: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentSection,
  totalPacksCount,
  onOpenFontTester,
  onOpenFrameTester,
  isSyncing,
  onSyncGitHub
}) => {
  const isEditor = currentSection === 'editor';

  return (
    <div className="relative border-b border-white/[0.08] bg-gradient-to-b from-[#08090e] via-[#07080c] to-[#07080c] py-8 sm:py-12 overflow-hidden">
      {/* Background ambient lighting */}
      <div 
        className={`absolute top-0 right-1/4 w-[450px] h-[220px] rounded-full blur-[130px] pointer-events-none transition-colors duration-700 opacity-20 ${
          isEditor ? 'bg-cyan-500' : 'bg-purple-600'
        }`} 
      />
      <div 
        className={`absolute bottom-0 left-1/4 w-[350px] h-[180px] rounded-full blur-[110px] pointer-events-none transition-colors duration-700 opacity-15 ${
          isEditor ? 'bg-blue-600' : 'bg-pink-600'
        }`} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-right">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            {/* Pill tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-slate-300">
              <span className={`w-2 h-2 rounded-full ${isEditor ? 'bg-cyan-400' : 'bg-purple-400'} shadow-[0_0_8px_currentColor]`} />
              <span className="font-semibold text-white">
                {isEditor ? 'کالکشن تخصصی ادیت ویدیو' : 'کالکشن اختصاصی لایواستریم و OBS'}
              </span>
              <span className="text-slate-400 text-[11px]">•</span>
              <span className="text-slate-400 text-[11px] font-mono dir-ltr">Vidox-ir/toolbox</span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-white font-extrabold tracking-tight leading-tight">
              {isEditor ? (
                <>
                  دانلود رایگان پک‌های تدوین، فونت و{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400">
                    ترنزیشن‌های ویدیویی
                  </span>
                </>
              ) : (
                <>
                  دانلود رایگان کادر وبکم، اورلی و{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-pink-400">
                    استینگرهای استریم
                  </span>
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-light">
              {isEditor 
                ? 'تمام ابزارهای مورد نیاز برای خلق ویدیوهای پربازدید یوتیوب و اینستاگرام با لینک دانلود مستقیم و پرسرعت از مخزن گیت‌هاب.'
                : 'مجموعه کادرهای وبکم متحرک، بسته‌های کامل صحنه‌های استریم و استینگرهای هماهنگ با OBS Studio بدون افت فریم.'}
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              {isEditor ? (
                <button
                  onClick={onOpenFontTester}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all cursor-pointer"
                >
                  <Type className="w-3.5 h-3.5 text-cyan-400" />
                  <span>تستر آنلاین فونت‌ها</span>
                </button>
              ) : (
                <button
                  onClick={onOpenFrameTester}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-all cursor-pointer"
                >
                  <Video className="w-3.5 h-3.5 text-purple-400" />
                  <span>شبیه‌ساز زنده وبکم</span>
                </button>
              )}

              <a
                href="#catalog-view"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.08] transition-colors"
              >
                <ArrowDown className="w-3.5 h-3.5 text-slate-400" />
                <span>مشاهده پک‌های موجود ({totalPacksCount})</span>
              </a>
            </div>
          </div>

          {/* Quick Stats & Repo Status Badge */}
          <div className="flex items-center md:flex-col justify-between md:items-end gap-3 p-4 rounded-2xl bg-[#0b0d14] border border-white/[0.08] text-right">
            <div className="space-y-1">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3 h-3 text-cyan-400" />
                تعداد پک‌های آماده دانلود:
              </span>
              <div className="text-2xl font-black font-display text-white">
                {totalPacksCount} <span className="text-xs font-normal text-slate-400">پک فعال</span>
              </div>
            </div>

            <button
              onClick={onSyncGitHub}
              disabled={isSyncing}
              className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'در حال بررسی مخزن...' : 'بررسی مجدد مخزن'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
