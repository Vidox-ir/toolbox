export type SectionType = 'editor' | 'streamer';

export type EditorCategory = 
  | 'all'
  | 'fonts' 
  | 'transitions' 
  | 'sfx' 
  | 'presets' 
  | 'overlays' 
  | 'memes';

export type StreamerCategory = 
  | 'all'
  | 'webcam-frames' 
  | 'stream-packages' 
  | 'chat-alerts' 
  | 'stingers' 
  | 'panels-banners' 
  | 'goals-badges';

export interface PackItem {
  id: string;
  title: string;
  titleEn: string;
  section: SectionType;
  category: string;
  categoryFa: string;
  badge?: string;
  isFeatured?: boolean;
  downloadsCount: number;
  rating: number;
  fileSize: string;
  version: string;
  updatedDate: string;
  itemsCount: string;
  format: string[];
  software: string[];
  thumbnail: string;
  previewImages: string[];
  description: string;
  features: string[];
  installGuide: string[];
  tags: string[];
  githubTag: string;
  githubFilename: string;
  directDownloadUrl?: string;
  fontDemo?: {
    family: string;
    sampleText: string;
  };
  frameStyle?: {
    neonColor: string;
    ratio: string;
  };
}

export interface GitHubConfig {
  username: string;
  repository: string;
  branch: string;
  releaseTagDefault: string;
}
