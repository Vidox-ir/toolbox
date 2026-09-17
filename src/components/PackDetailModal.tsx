import React, { useState } from 'react';
import { PackItem, GitHubConfig } from '../types';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  Github, 
  Sparkles, 
  Layers, 
  HardDrive, 
  Calendar, 
  Tag, 
  CheckCircle2, 
  HelpCircle, 
  Type, 
  Video, 
  ExternalLink,
  ShieldCheck,
  Star
} from 'lucide-react';

interface PackDetailModalProps {
  pack: PackItem | null;
  onClose: () => void;
  githubConfig: GitHubConfig;
  onOpenFontTester: (sampleText?: string) => void;
  onOpenFrameTester: () => void;
}

export const PackDetailModal: React.FC<PackDetailModalProps> = ({
  pack,
  onClose,
  githubConfig,
  onOpenFontTester,
  onOpenFrameTester
}) => {
  if (!pack) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const isEditor = pack.section === 'editor';

  // Construct standard GitHub Release Download URL
  const githubDownloadUrl = pack.directDownloadUrl || 
    `https://github.com/${githubConfig.username}/${githubConfig.repository}/releases/download/${pack.githubTag}/${pack.githubFilename}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(githubDownloadUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleDownload = () => {
    setDownloadSuccess(true);
    // Trigger download in new window/tab safely
    const a = document.createElement('a');
    a.href = githubDownloadUrl;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.download = pack.githubFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-4xl bg-[#090d16] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto text-right max-h-[92vh] flex flex-col">
        {/* Header bar */}
        <div className="p-4 sm:px-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className={`text-xs px-3 py-1 rounded-full font-bold ${
              isEditor ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
            }`}>
              {pack.categoryFa}
            </span>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              کد مخزن: {pack.githubFilename}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Main Gallery Area */}
          <div className="space-y-3">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl">
              <img
                src={pack.previewImages[activeImageIndex] || pack.thumbnail}
                alt={pack.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {pack.badge && (
                <span className="absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-xl bg-cyan-500 text-black shadow-lg">
                  {pack.badge}
                </span>
              )}

              <div className="absolute bottom-4 right-4 left-4 flex items-center justify-between pointer-events-none">
                <span className="bg-black/80 backdrop-blur-md text-xs text-slate-200 px-3 py-1 rounded-lg border border-white/10 font-mono">
                  نسخه {pack.version}
                </span>
                <span className="bg-black/80 backdrop-blur-md text-xs text-amber-300 px-3 py-1 rounded-lg border border-white/10 flex items-center gap-1 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  امتیاز {pack.rating} از ۵
                </span>
              </div>
            </div>

            {/* Thumbnail switcher if multiple images */}
            {pack.previewImages.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {pack.previewImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer flex-shrink-0 ${
                      activeImageIndex === idx
                        ? 'border-cyan-400 shadow-md shadow-cyan-500/30'
                        : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Preview thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & English Code */}
          <div>
            <div className="text-xs text-slate-400 font-mono dir-ltr mb-1">{pack.titleEn}</div>
            <h2 className="font-display text-2xl sm:text-3xl text-white leading-snug">
              {pack.title}
            </h2>
          </div>

          {/* Interactive Tester Banner for Fonts or Frames */}
          {pack.category === 'fonts' && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-slate-900 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0">
                  <Type className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">تست زنده این فونت‌ها با متن دلخواه شما</h4>
                  <p className="text-xs text-slate-300">قبل از دانلود، تیتر تامبنیل یا تیتراژ خود را بنویسید و پیش‌نمایش بگیرید.</p>
                </div>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenFontTester(pack.fontDemo?.sampleText || 'تست تیتر تامبنیل ویدیو با فونت لاله زار و وزیر');
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-black hover:bg-cyan-400 transition-colors cursor-pointer whitespace-nowrap shadow-md shadow-cyan-500/20"
              >
                باز کردن تستر زنده فونت
              </button>
            </div>
          )}

          {pack.category === 'webcam-frames' && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-pink-950/30 to-slate-900 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">تست زنده کادر وبکم روی دوربین و تصویر استریم</h4>
                  <p className="text-xs text-slate-300">کادرها را روی تصویر وبکم خود یا تصویر بازی تست کنید.</p>
                </div>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenFrameTester();
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 text-white hover:bg-purple-500 transition-colors cursor-pointer whitespace-nowrap shadow-md shadow-purple-500/20"
              >
                باز کردن شبیه‌ساز وبکم
              </button>
            </div>
          )}

          {/* Technical Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="space-y-1">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <HardDrive className="w-3 h-3 text-cyan-400" />
                حجم فایل دانلودی:
              </span>
              <div className="text-sm font-bold text-white">{pack.fileSize}</div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Layers className="w-3 h-3 text-purple-400" />
                تعداد محتوا:
              </span>
              <div className="text-sm font-bold text-white">{pack.itemsCount}</div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-amber-400" />
                تاریخ بروزرسانی:
              </span>
              <div className="text-sm font-bold text-white">{pack.updatedDate}</div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Tag className="w-3 h-3 text-emerald-400" />
                فرمت‌های فایل:
              </span>
              <div className="text-xs font-bold text-slate-300 font-mono">
                {pack.format.join(' , ')}
              </div>
            </div>
          </div>

          {/* Full Persian Description */}
          <div className="space-y-2">
            <h3 className="font-display text-lg text-white">توضیحات و کاربرد این پک</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {pack.description}
            </p>
          </div>

          {/* Features Checklist */}
          <div className="space-y-3">
            <h3 className="font-display text-lg text-white">ویژگی‌های برجسته و کلیدی</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {pack.features.map((feat, index) => (
                <div key={index} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300 bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/60">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Software Compatibility */}
          <div className="space-y-2">
            <h3 className="font-display text-lg text-white">سازگار با نرم‌افزارهای</h3>
            <div className="flex flex-wrap gap-2">
              {pack.software.map((sw) => (
                <span
                  key={sw}
                  className="px-3 py-1 rounded-xl text-xs font-medium bg-slate-900 text-slate-200 border border-slate-700 flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  {sw}
                </span>
              ))}
            </div>
          </div>

          {/* Step-by-Step Installation Guide */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span>راهنمای سریع نصب و استفاده در سیستم</span>
            </div>
            <ol className="space-y-2 text-xs sm:text-sm text-slate-300 list-decimal list-inside pr-1">
              {pack.installGuide.map((step, idx) => (
                <li key={idx} className="leading-relaxed">
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Download & GitHub Release Info Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-[#07090e] border border-cyan-500/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <Github className="w-4 h-4" />
                <span>لینک دانلود مستقیم از مخزن رسمی گیت‌هاب</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>تایید شده و بدون ویروس (آنتی‌ویروس اسکن شده)</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={handleDownload}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base text-white shadow-xl transition-all cursor-pointer ${
                  isEditor 
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-cyan-500/25' 
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-purple-500/25'
                }`}
              >
                <Download className="w-5 h-5" />
                <span>دانلود مستقیم فایل ZIP ({pack.fileSize})</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer whitespace-nowrap"
                title="کپی کردن لینک دانلود مستقیم"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'لینک کپی شد!' : 'کپی لینک مخزن'}</span>
              </button>
            </div>

            {/* Direct GitHub file path indicator */}
            <div className="text-[11px] text-slate-400 dir-ltr font-mono bg-black/50 p-2.5 rounded-xl break-all flex items-center justify-between gap-2 border border-slate-800">
              <span className="truncate">{githubDownloadUrl}</span>
              <a
                href={`https://github.com/${githubConfig.username}/${githubConfig.repository}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 flex-shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>مشاهده مخزن</span>
              </a>
            </div>

            {downloadSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
                <Check className="w-4 h-4 flex-shrink-0" />
                <span>
                  دانلود در تب جدید شروع شد! اگر دانلود آغاز نشد، بر روی دکمه «کپی لینک مخزن» کلیک کنید.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>تگ‌ها:</span>
            <div className="flex flex-wrap gap-1">
              {pack.tags.map((t) => (
                <span key={t} className="text-slate-400">#{t}</span>
              ))}
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            بستن پنجره
          </button>
        </div>
      </div>
    </div>
  );
};
