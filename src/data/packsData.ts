import { PackItem, GitHubConfig } from '../types';

export const DEFAULT_GITHUB_CONFIG: GitHubConfig = {
  username: 'Vidox-ir',
  repository: 'toolbox',
  branch: 'main',
  releaseTagDefault: 'v1.0.0',
};

// No hardcoded dummy packs! All packs are fetched dynamically from the GitHub repository folders!
export const PACKS_DATA: PackItem[] = [];

export const EDITOR_CATEGORIES = [
  { id: 'all', label: 'همه پک‌های ادیتور', icon: 'Sparkles' },
  { id: 'fonts', label: 'فونت', icon: 'Type' },
  { id: 'transitions', label: 'ترنزیشن', icon: 'Flame' },
  { id: 'sfx', label: 'صدا و SFX', icon: 'Volume2' },
  { id: 'presets', label: 'پریست و رنگ', icon: 'Palette' },
  { id: 'assets', label: 'سایر ابزارها', icon: 'Layers' },
];

export const STREAMER_CATEGORIES = [
  { id: 'all', label: 'همه پک‌های استریم', icon: 'Sparkles' },
  { id: 'webcam-frames', label: 'کادر وبکم', icon: 'Video' },
  { id: 'stream-packages', label: 'اورلی و صحنه', icon: 'Layers' },
  { id: 'stingers', label: 'استینگر', icon: 'Zap' },
  { id: 'chat-alerts', label: 'چت‌باکس و بنر', icon: 'MessageSquare' },
];
