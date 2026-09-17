import React, { useState } from 'react';
import { 
  X, 
  Type, 
  Download, 
  Sparkles, 
  Sliders, 
  Palette, 
  Copy, 
  Check, 
  Maximize2 
} from 'lucide-react';

interface FontTesterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadFontPack: () => void;
  initialText?: string;
}

const FONTS_LIST = [
  { id: 'lalezar', name: 'لاله‌زار (Lalezar)', style: 'font-display', tag: 'محبوب‌ترین تامبنیل یوتیوب', desc: 'فونت ضخیم، فانتزی و با کنتراست شدید' },
  { id: 'vazir-black', name: 'وزیرمتن بلک (Vazirmatn Black)', style: 'font-body font-black', tag: 'تیتر مدرن و خوانا', desc: 'فوق‌العاده واضح در ابعاد بسیار کوچک موبایل' },
  { id: 'changa', name: 'چانگا بولد (Changa Gaming)', style: 'font-gaming font-extrabold', tag: 'سبک گیمینگ و اکشن', desc: 'فونت هندسی جذاب برای ویدیوهای بازی' },
  { id: 'rubik', name: 'روبیک بولد (Rubik Bold)', style: 'font-[Rubik] font-bold', tag: 'مینیمال تکنولوژی', desc: 'مناسب ولاگ‌های تکنولوژی و آموزشی' },
];

const PRESET_PHRASES = [
  'راز ساخت تامبنیل‌های ۱ میلیونی در یوتیوب!',
  'گیم‌پلی بازی جدید با بالاترین گرافیک ممکن!',
  'آموزش ادیت صفر تا صد در پریمیر پرو',
  'استریم ۲۴ ساعته با چالش دونیت و جوایز خفن',
];

const PRESET_COLORS = [
  { label: 'طلایی یوتیوبی', value: '#fbbf24', stroke: '#000000', glow: 'rgba(251, 191, 36, 0.4)' },
  { label: 'فیروزه‌ای سایبر', value: '#22d3ee', stroke: '#000000', glow: 'rgba(34, 211, 238, 0.4)' },
  { label: 'سفید خالص', value: '#ffffff', stroke: '#000000', glow: 'rgba(255, 255, 255, 0.2)' },
  { label: 'سرخ آتشین', value: '#f43f5e', stroke: '#000000', glow: 'rgba(244, 63, 94, 0.4)' },
  { label: 'سبز نئون', value: '#4ade80', stroke: '#000000', glow: 'rgba(74, 222, 128, 0.4)' },
];

const BACKGROUND_PRESETS = [
  { label: 'دارک استودیو', value: 'bg-[#090d16]' },
  { label: 'قرمز گیمینگ', value: 'bg-gradient-to-r from-red-950 via-neutral-900 to-black' },
  { label: 'سایبرپانک', value: 'bg-gradient-to-r from-cyan-950 via-purple-950 to-neutral-950' },
  { label: 'پرده سبز (Chroma Key)', value: 'bg-[#00b140]' },
];

export const FontTesterModal: React.FC<FontTesterModalProps> = ({
  isOpen,
  onClose,
  onDownloadFontPack,
  initialText = 'راز ساخت تامبنیل‌های ۱ میلیونی در یوتیوب!'
}) => {
  if (!isOpen) return null;

  const [text, setText] = useState(initialText);
  const [selectedFont, setSelectedFont] = useState(FONTS_LIST[0].id);
  const [fontSize, setFontSize] = useState(48);
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [hasStroke, setHasStroke] = useState(true);
  const [hasShadow, setHasShadow] = useState(true);
  const [hasGlow, setHasGlow] = useState(true);
  const [selectedBg, setSelectedBg] = useState(BACKGROUND_PRESETS[0]);
  const [copied, setCopied] = useState(false);

  const activeFontObj = FONTS_LIST.find((f) => f.id === selectedFont) || FONTS_LIST[0];

  const handleCopyText = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-5xl bg-[#090d16] border border-cyan-500/40 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto text-right max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:px-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Type className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-xl text-white">تستر زنده فونت‌های فارسی اختصاصی</h2>
              <p className="text-xs text-slate-400">پیش‌نمایش استایل و تایپوگرافی تامبنیل و تیتراژ ویدیوها</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Live Canvas / Preview Stage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-200">پیش‌نمایش زنده در سایز {fontSize}px:</span>
              <span>فونت فعال: <strong className="text-cyan-400">{activeFontObj.name}</strong></span>
            </div>

            <div 
              className={`relative min-h-[220px] sm:min-h-[280px] rounded-2xl border border-slate-700/80 p-6 flex items-center justify-center text-center overflow-hidden transition-all duration-300 ${selectedBg.value}`}
            >
              {/* Subtle grid pattern overlay */}
              <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

              <div 
                className={`${activeFontObj.style} select-none transition-all duration-150 leading-tight break-words max-w-3xl z-10`}
                style={{
                  fontSize: `${fontSize}px`,
                  color: selectedColor.value,
                  WebkitTextStroke: hasStroke ? `3px ${selectedColor.stroke}` : 'none',
                  textShadow: [
                    hasShadow ? '0 10px 25px rgba(0,0,0,0.9), 0 4px 6px rgba(0,0,0,0.8)' : '',
                    hasGlow ? `0 0 30px ${selectedColor.glow}` : ''
                  ].filter(Boolean).join(', ') || 'none'
                }}
              >
                {text || 'متن خود را اینجا تایپ کنید...'}
              </div>

              <div className="absolute bottom-3 right-3 text-[10px] text-slate-400/80 bg-black/60 px-2 py-1 rounded-md backdrop-blur-sm border border-white/5 font-mono">
                Vidox Toolbox • Persian Typography Engine
              </div>
            </div>
          </div>

          {/* Text Input & Quick Preset Phrases */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">متن تستی تامبنیل یا تیتراژ شما:</label>
            <div className="relative">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="تایپ کنید..."
                className="w-full bg-slate-900 text-sm text-white rounded-xl py-3 px-4 border border-slate-800 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
              <button
                onClick={handleCopyText}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 cursor-pointer"
                title="کپی کردن متن"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copied ? 'کپی شد' : 'کپی'}</span>
              </button>
            </div>

            {/* Preset phrases chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1">
              <span className="text-[11px] text-slate-500 whitespace-nowrap">پیشنهاد سریع:</span>
              {PRESET_PHRASES.map((phrase, i) => (
                <button
                  key={i}
                  onClick={() => setText(phrase)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 whitespace-nowrap cursor-pointer"
                >
                  {phrase.slice(0, 24)}...
                </button>
              ))}
            </div>
          </div>

          {/* Font Selector Cards */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">انتخاب خانواده فونت فارسی:</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
              {FONTS_LIST.map((font) => {
                const isSelected = selectedFont === font.id;
                return (
                  <button
                    key={font.id}
                    onClick={() => setSelectedFont(font.id)}
                    className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-md shadow-cyan-500/20'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">{font.name}</span>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-cyan-400" />}
                    </div>
                    <span className="text-[10px] text-cyan-400 block mb-1">{font.tag}</span>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{font.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Controls: Size, Colors, Effects, Background */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            {/* Left Column: Sliders & Effects */}
            <div className="space-y-4">
              {/* Font Size */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="flex items-center gap-1 font-medium">
                    <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                    اندازه قلم (Font Size):
                  </span>
                  <span className="font-mono text-cyan-400">{fontSize}px</span>
                </div>
                <input
                  type="range"
                  min="24"
                  max="96"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={() => setHasStroke(!hasStroke)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    hasStroke
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {hasStroke ? '✓ کادر مشکی (Stroke)' : 'بدون کادر'}
                </button>

                <button
                  onClick={() => setHasShadow(!hasShadow)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    hasShadow
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/50'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {hasShadow ? '✓ سایه سه‌بعدی (Shadow)' : 'بدون سایه'}
                </button>

                <button
                  onClick={() => setHasGlow(!hasGlow)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    hasGlow
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {hasGlow ? '✓ درخشش نئونی (Glow)' : 'بدون گلو'}
                </button>
              </div>
            </div>

            {/* Right Column: Colors & Background */}
            <div className="space-y-4">
              {/* Color Presets */}
              <div className="space-y-1.5">
                <span className="text-xs text-slate-300 flex items-center gap-1 font-medium">
                  <Palette className="w-3.5 h-3.5 text-amber-400" />
                  رنگ نوشته تامبنیلی:
                </span>
                <div className="flex items-center gap-2">
                  {PRESET_COLORS.map((col, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(col)}
                      className={`h-8 flex-1 rounded-xl border-2 transition-all flex items-center justify-center cursor-pointer ${
                        selectedColor.value === col.value
                          ? 'border-white scale-105 shadow-md'
                          : 'border-transparent opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: col.value }}
                      title={col.label}
                    >
                      {selectedColor.value === col.value && (
                        <Check className="w-4 h-4 text-black font-bold" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Background Preset */}
              <div className="space-y-1.5">
                <span className="text-xs text-slate-300 font-medium">پس‌زمینه تستر:</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {BACKGROUND_PRESETS.map((bg, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedBg(bg)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] border transition-all cursor-pointer ${
                        selectedBg.label === bg.label
                          ? 'bg-slate-700 text-white border-cyan-400 font-bold'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {bg.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-4 sm:px-6 border-t border-slate-800 bg-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400 text-center sm:text-right">
            پک کامل شامل ۴۰ فونت فارسی اختصاصی با فرمت‌های TTF و OTF به صورت مستقیم از گیت‌هاب قابل دانلود است.
          </div>

          <button
            onClick={() => {
              onClose();
              onDownloadFontPack();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>دانلود پک ۴۰ فونت فارسی یوتیوب (۳۸ MB)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
