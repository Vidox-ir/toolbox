import React from 'react';
import { SectionType, GitHubConfig } from '../types';
import { 
  Github, 
  Clapperboard, 
  Gamepad2, 
  Heart, 
  Type, 
  Video,
  ArrowUp,
  Sparkles
} from 'lucide-react';

interface FooterProps {
  onSectionChange: (sec: SectionType) => void;
  onOpenFontTester: () => void;
  onOpenFrameTester: () => void;
  githubConfig: GitHubConfig;
}

export const Footer: React.FC<FooterProps> = ({
  onSectionChange,
  onOpenFontTester,
  onOpenFrameTester,
  githubConfig
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/[0.07] bg-[#06070a] text-right relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand & Intro */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-[1.5px] shadow-lg shadow-cyan-500/20">
                <div className="w-full h-full bg-[#090b11] rounded-[10px] flex items-center justify-center">
                  <span className="font-display text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                    V
                  </span>
                </div>
              </div>
              <span className="font-display text-2xl font-bold text-white">
                جعبه ابزار ویدوکس <span className="text-cyan-400 font-mono text-sm">(Vidox Toolbox)</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-lg font-light">
              مرجع جامع و رایگان دانلود پک‌های اختصاصی برای ادیتورهای ویدیو و استریمرهای فارسی‌زبان. تمامی ابزارها، فونت‌ها، ترنزیشن‌ها و کادرهای وبکم به صورت ۱۰۰٪ رایگان و با لینک مستقیم در مخزن گیت‌هاب قرار دارند.
            </p>

            <div className="pt-2">
              <a
                href={`https://github.com/${githubConfig.username}/${githubConfig.repository}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/[0.08] text-xs font-medium transition-colors"
              >
                <Github className="w-4 h-4 text-cyan-400" />
                <span className="dir-ltr font-mono text-[11px]">{githubConfig.username}/{githubConfig.repository}</span>
              </a>
            </div>
          </div>

          {/* Col 2: Editor packs */}
          <div className="space-y-3">
            <h4 className="font-display text-base font-bold text-white flex items-center gap-2">
              <Clapperboard className="w-4 h-4 text-cyan-400" />
              <span>پک‌های ادیتور (ویدیو)</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button 
                  onClick={() => {
                    onSectionChange('editor');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  فونت‌های تیتراژ و تامبنیل یوتیوب
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    onSectionChange('editor');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  ترنزیشن‌های داینامیک پریمیر و افتر افکت
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    onSectionChange('editor');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  ساند افکت‌ها و وووش‌های تدوین (SFX)
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenFontTester} 
                  className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 cursor-pointer pt-1"
                >
                  <Type className="w-3 h-3" />
                  <span>تستر زنده فونت‌های فارسی</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Streamer packs */}
          <div className="space-y-3">
            <h4 className="font-display text-base font-bold text-white flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-purple-400" />
              <span>پک‌های استریمر (لایو)</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button 
                  onClick={() => {
                    onSectionChange('streamer');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="hover:text-purple-400 transition-colors cursor-pointer"
                >
                  کادرهای وبکم متحرک نئونی
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    onSectionChange('streamer');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="hover:text-purple-400 transition-colors cursor-pointer"
                >
                  پکیج کامل صحنه‌های استریم (Starting & BRB)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    onSectionChange('streamer');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="hover:text-purple-400 transition-colors cursor-pointer"
                >
                  استینگر ترنزیشن‌های OBS
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenFrameTester} 
                  className="text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 cursor-pointer pt-1"
                >
                  <Video className="w-3 h-3" />
                  <span>شبیه‌ساز زنده کادر وبکم</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <span>طراحی شده با</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 mx-0.5" />
            <span>برای جامعه تولیدکنندگان محتوا و استریمرها • جعبه ابزار ویدوکس</span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.08] transition-colors cursor-pointer"
          >
            <ArrowUp className="w-3.5 h-3.5 text-cyan-400" />
            <span>بازگشت به بالای صفحه</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
