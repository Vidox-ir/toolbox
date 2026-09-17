import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Video, 
  Download, 
  Camera, 
  Sparkles, 
  Ratio, 
  Layers, 
  User, 
  Heart, 
  Coins, 
  Radio, 
  EyeOff 
} from 'lucide-react';

interface WebcamFrameTesterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadStreamPack: () => void;
}

const FRAME_STYLES = [
  { id: 'cyber-cyan', name: 'سایبر نئون (Cyan)', color: '#00f0ff', borderClass: 'neon-border-cyan', glowClass: 'shadow-[0_0_25px_rgba(0,240,255,0.4)]' },
  { id: 'neon-purple', name: 'بنفش گیمینگ (Violet)', color: '#a855f7', borderClass: 'neon-border-purple', glowClass: 'shadow-[0_0_25px_rgba(168,85,247,0.4)]' },
  { id: 'fire-red', name: 'سرخ متحرک (Fire Red)', color: '#ef4444', borderClass: 'border-red-500', glowClass: 'shadow-[0_0_25px_rgba(239,68,68,0.4)]' },
  { id: 'matrix-emerald', name: 'سبز ماتریکس (Matrix)', color: '#10b981', borderClass: 'border-emerald-400', glowClass: 'shadow-[0_0_25px_rgba(16,185,129,0.4)]' },
  { id: 'gold-vip', name: 'طلایی متالیک (Gold VIP)', color: '#f59e0b', borderClass: 'border-amber-400', glowClass: 'shadow-[0_0_25px_rgba(245,158,11,0.4)]' },
];

export const WebcamFrameTesterModal: React.FC<WebcamFrameTesterModalProps> = ({
  isOpen,
  onClose,
  onDownloadStreamPack
}) => {
  if (!isOpen) return null;

  const [selectedFrame, setSelectedFrame] = useState(FRAME_STYLES[0]);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '4:3'>('16:9');
  const [streamerName, setStreamerName] = useState('VidoxStreamer');
  const [showWidgets, setShowWidgets] = useState(true);
  const [showLiveBadge, setShowLiveBadge] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Toggle real webcam
  const toggleRealCamera = async () => {
    if (cameraActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setCameraActive(false);
      return;
    }

    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch (err: any) {
      setCameraError('دسترسی به دوربین داده نشد یا دوربینی یافت نشد. از شبیه‌ساز گیمینگ استفاده شد.');
      setCameraActive(false);
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-5xl bg-[#090d16] border border-purple-500/40 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto text-right max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:px-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-xl text-white">شبیه‌ساز زنده کادر وبکم و استریم</h2>
              <p className="text-xs text-slate-400">تست کادرهای وبکم، جایگذاری آیدی شبکه‌های اجتماعی و ویجت‌های OBS</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Main Stage */}
          <div className="relative flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden min-h-[320px] sm:min-h-[400px]">
            {/* Background gaming room backdrop */}
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-[#0a0f1d] to-[#120824] opacity-80" />
            <div className="absolute inset-0 bg-grid-pattern opacity-25" />

            {/* Frame Container */}
            <div 
              className={`relative transition-all duration-300 overflow-hidden rounded-2xl border-2 ${selectedFrame.borderClass} ${selectedFrame.glowClass} ${
                aspectRatio === '16:9' ? 'w-full max-w-[540px] aspect-video' : 'w-full max-w-[420px] aspect-[4/3]'
              }`}
            >
              {/* Video or Simulated Gamer Background */}
              {cameraActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
              ) : (
                <div className="relative w-full h-full bg-slate-900 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80"
                    alt="Streamer mockup"
                    className="w-full h-full object-cover opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                </div>
              )}

              {/* Overlay: Live Badge */}
              {showLiveBadge && (
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600/90 text-white text-[11px] font-bold backdrop-blur-md shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  <span>LIVE</span>
                </div>
              )}

              {/* Overlay: Top resolution watermark */}
              <div className="absolute top-3 left-3 text-[10px] text-slate-300 font-mono bg-black/60 px-2 py-0.5 rounded backdrop-blur-md border border-white/10">
                1080p • 60 FPS
              </div>

              {/* Overlay: Streamer Name Bar */}
              <div 
                className="absolute bottom-0 inset-x-0 p-2.5 bg-gradient-to-t from-black via-black/80 to-transparent flex items-center justify-between border-t"
                style={{ borderColor: `${selectedFrame.color}40` }}
              >
                <div className="flex items-center gap-1.5">
                  <div 
                    className="w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold text-black"
                    style={{ backgroundColor: selectedFrame.color }}
                  >
                    V
                  </div>
                  <span className="text-xs font-bold text-white tracking-wide font-mono">
                    @{streamerName || 'VidoxStreamer'}
                  </span>
                </div>

                {showWidgets && (
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <Coins className="w-3 h-3" />
                      دونیت: ۵۰,۰۰۰ تومان
                    </span>
                    <span className="flex items-center gap-1 text-pink-400 font-medium hidden sm:flex">
                      <Heart className="w-3 h-3 fill-current" />
                      فالوور جدید
                    </span>
                  </div>
                )}
              </div>

              {/* Corner Cyber Accents */}
              <div 
                className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2" 
                style={{ borderColor: selectedFrame.color }} 
              />
              <div 
                className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2" 
                style={{ borderColor: selectedFrame.color }} 
              />
              <div 
                className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2" 
                style={{ borderColor: selectedFrame.color }} 
              />
              <div 
                className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2" 
                style={{ borderColor: selectedFrame.color }} 
              />
            </div>

            {cameraError && (
              <div className="mt-3 text-xs text-amber-400 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20">
                {cameraError}
              </div>
            )}
          </div>

          {/* Controls Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            {/* Style Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">انتخاب استایل و تم کادر نئونی:</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {FRAME_STYLES.map((frame) => (
                  <button
                    key={frame.id}
                    onClick={() => setSelectedFrame(frame)}
                    className={`p-2 rounded-xl text-xs font-medium border transition-all text-right cursor-pointer flex items-center justify-between ${
                      selectedFrame.id === frame.id
                        ? 'bg-purple-950/40 border-purple-400 text-white font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <span>{frame.name}</span>
                    <span 
                      className="w-3 h-3 rounded-full border border-white/40" 
                      style={{ backgroundColor: frame.color }} 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Customization Options */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {/* Camera Toggle */}
                <button
                  onClick={toggleRealCamera}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    cameraActive
                      ? 'bg-red-500/20 text-red-300 border-red-500/50'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{cameraActive ? 'خاموش کردن دوربین' : 'تست با دوربین وبکم واقعی'}</span>
                </button>

                {/* Aspect Ratio Switch */}
                <button
                  onClick={() => setAspectRatio(aspectRatio === '16:9' ? '4:3' : '16:9')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 cursor-pointer"
                >
                  <Ratio className="w-3.5 h-3.5 text-purple-400" />
                  <span>نسبت ابعاد: {aspectRatio}</span>
                </button>

                {/* Widgets Toggle */}
                <button
                  onClick={() => setShowWidgets(!showWidgets)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    showWidgets
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/50'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {showWidgets ? '✓ ویجت‌های دونیت فعال' : 'بدون ویجت'}
                </button>
              </div>

              {/* Streamer Name input */}
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">آیدی یا نام نمایشی استریم شما:</label>
                <input
                  type="text"
                  value={streamerName}
                  onChange={(e) => setStreamerName(e.target.value)}
                  placeholder="مثلاً: Vidox_Gamer"
                  className="w-full bg-slate-900 text-xs text-white rounded-xl py-2 px-3 border border-slate-800 focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:px-6 border-t border-slate-800 bg-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400 text-center sm:text-right">
            فرمت‌های خروجی: فایل‌های متحرک سبک WebM با قابلیت لوپ در OBS بدون مصرف CPU + سورس‌های لایه‌باز PSD
          </div>

          <button
            onClick={() => {
              onClose();
              onDownloadStreamPack();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-500/25 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>دانلود پک ۲۰ کادر وبکم متحرک استریم (۶۵ MB)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
