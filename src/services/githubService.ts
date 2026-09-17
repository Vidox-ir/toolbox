import { PackItem, SectionType } from '../types';

export interface GitHubContentItem {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string | null;
  type: 'file' | 'dir';
}

const GITHUB_OWNER = 'Vidox-ir';
const GITHUB_REPO = 'toolbox';
const GITHUB_BRANCH = 'main';

// Helper to format byte size to human readable (MB/KB)
export function formatBytes(bytes: number, decimals = 1): string {
  if (!bytes || bytes === 0) return 'نامشخص';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const val = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
  return `${val} ${sizes[i]}`;
}

// Convert slug or folder name to clean Persian title
function cleanTitle(name: string): string {
  // Remove extension if present
  const base = name.replace(/\.(zip|rar|7z|tar\.gz)$/i, '');
  // Replace dashes and underscores with spaces
  const spaced = base.replace(/[-_]+/g, ' ').trim();
  // Capitalize or format
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

// Generate sensible default category
function detectCategory(name: string, section: SectionType): { category: string; categoryFa: string } {
  const lower = name.toLowerCase();
  if (section === 'editor') {
    if (lower.includes('font') || lower.includes('فونت')) return { category: 'fonts', categoryFa: 'فونت' };
    if (lower.includes('trans') || lower.includes('ترنزیشن')) return { category: 'transitions', categoryFa: 'ترنزیشن' };
    if (lower.includes('sfx') || lower.includes('sound') || lower.includes('صوت') || lower.includes('صدا')) return { category: 'sfx', categoryFa: 'ساند افکت' };
    if (lower.includes('lut') || lower.includes('color') || lower.includes('رنگ') || lower.includes('preset')) return { category: 'presets', categoryFa: 'پریست و رنگ' };
    return { category: 'assets', categoryFa: 'ابزار ادیت' };
  } else {
    if (lower.includes('webcam') || lower.includes('frame') || lower.includes('کادر') || lower.includes('وبکم')) return { category: 'webcam-frames', categoryFa: 'کادر وبکم' };
    if (lower.includes('stinger') || lower.includes('استینگر')) return { category: 'stingers', categoryFa: 'استینگر' };
    if (lower.includes('chat') || lower.includes('alert') || lower.includes('چت') || lower.includes('آلرت')) return { category: 'chat-alerts', categoryFa: 'چت‌باکس و آلرت' };
    return { category: 'stream-packages', categoryFa: 'پک استریم' };
  }
}

// Default placeholder covers based on category if no preview image uploaded
const DEFAULT_COVERS: Record<string, string> = {
  editor: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=900&q=80',
  streamer: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80',
  fonts: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=900&q=80',
  transitions: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=900&q=80',
  'webcam-frames': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80'
};

/**
 * Fetch directory contents from GitHub API
 */
async function fetchGitHubDirectory(path: string): Promise<GitHubContentItem[] | null> {
  try {
    const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`;
    const res = await fetch(url, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`GitHub API returned status ${res.status}`);
    }

    const data = await res.json();
    return Array.isArray(data) ? data : null;
  } catch (err) {
    console.warn(`Could not fetch path ${path} from GitHub:`, err);
    return null;
  }
}

/**
 * Read info text or description file if present
 */
async function fetchFileText(downloadUrl: string): Promise<string | null> {
  try {
    const res = await fetch(downloadUrl);
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

/**
 * Main dynamic loader that inspects Vidox-ir/toolbox:
 * Searches for packs inside:
 * 1. `packs/editor/`
 * 2. `packs/streamer/`
 * 3. `packs/` (subfolders or direct zip files)
 */
export async function fetchPacksFromGitHub(): Promise<{
  packs: PackItem[];
  source: 'github-live' | 'cache' | 'empty';
  error?: string;
}> {
  const CACHE_KEY = 'vidox_github_live_packs';
  const CACHE_TIME_KEY = 'vidox_github_live_packs_time';

  try {
    const collectedPacks: PackItem[] = [];

    // Helper to process a folder or file item
    const processSection = async (sectionPath: string, section: SectionType) => {
      const items = await fetchGitHubDirectory(sectionPath);
      if (!items || items.length === 0) return;

      for (const item of items) {
        // CASE 1: Subfolder per pack (e.g. packs/editor/cool-fonts/)
        if (item.type === 'dir') {
          const folderContents = await fetchGitHubDirectory(item.path);
          if (!folderContents || folderContents.length === 0) continue;

          // Find zip or archive file
          const archiveFile = folderContents.find((f) => 
            f.name.match(/\.(zip|rar|7z|tar\.gz|mogrt|cube|ttf|otf)$/i)
          );

          // Find image file for preview
          const imageFile = folderContents.find((f) =>
            f.name.match(/\.(png|jpe?g|webp|gif|svg)$/i)
          );

          // Find info or description file
          const infoFile = folderContents.find((f) =>
            f.name.match(/(info|description|readme|details|about)\.(txt|md|json)$/i)
          );

          let description = `پک اختصاصی ${item.name} با دانلود مستقیم از مخزن گیت‌هاب ویدوکس.`;
          let customTitle = cleanTitle(item.name);

          if (infoFile && infoFile.download_url) {
            const txt = await fetchFileText(infoFile.download_url);
            if (txt && txt.trim()) {
              const lines = txt.trim().split('\n').filter(Boolean);
              if (lines.length > 0) {
                // If first line is a title
                if (lines[0].length < 60) {
                  customTitle = lines[0].replace(/^[#\s]+/, '').trim();
                  description = lines.slice(1).join(' ').trim() || description;
                } else {
                  description = lines.join(' ').trim();
                }
              }
            }
          }

          const { category, categoryFa } = detectCategory(item.name, section);
          const downloadUrl = archiveFile?.download_url || 
            `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${item.path}/${archiveFile?.name || 'pack.zip'}`;

          collectedPacks.push({
            id: `gh-${section}-${item.name}`,
            title: customTitle,
            titleEn: item.name,
            section,
            category,
            categoryFa,
            downloadsCount: 0,
            rating: 5.0,
            fileSize: archiveFile ? formatBytes(archiveFile.size) : 'فایل فشرده',
            version: 'v1.0',
            updatedDate: 'تازه اضافه شده',
            itemsCount: archiveFile?.name || 'پک کامل',
            format: archiveFile ? [archiveFile.name.split('.').pop()?.toUpperCase() || 'ZIP'] : ['ZIP'],
            software: section === 'editor' ? ['Premiere Pro', 'After Effects', 'Photoshop'] : ['OBS Studio', 'Streamlabs'],
            thumbnail: imageFile?.download_url || DEFAULT_COVERS[category] || DEFAULT_COVERS[section],
            previewImages: imageFile?.download_url ? [imageFile.download_url] : [DEFAULT_COVERS[category] || DEFAULT_COVERS[section]],
            description,
            features: [
              'دانلود مستقیم و بدون واسطه از گیت‌هاب',
              'تست‌شده و بدون باگ یا ارور',
              `فایل: ${archiveFile?.name || 'آرشیو'}`
            ],
            installGuide: [
              'فایل را دانلود و اکسترکت کنید.',
              'محتویات را در نرم‌افزار مربوطه استفاده نمایید.'
            ],
            tags: [section === 'editor' ? 'ادیتور' : 'استریمر', categoryFa, item.name],
            githubTag: 'main',
            githubFilename: archiveFile?.name || `${item.name}.zip`,
            directDownloadUrl: downloadUrl
          });
        } 
        // CASE 2: Direct ZIP file inside section folder (e.g. packs/editor/cool-fonts.zip)
        else if (item.type === 'file' && item.name.match(/\.(zip|rar|7z|tar\.gz)$/i)) {
          const { category, categoryFa } = detectCategory(item.name, section);
          const customTitle = cleanTitle(item.name);

          // Check if there's a matching image file in the same folder with .png or .jpg
          const baseName = item.name.replace(/\.(zip|rar|7z|tar\.gz)$/i, '');
          const matchingImg = items.find((f) => 
            f.type === 'file' && f.name.startsWith(baseName) && f.name.match(/\.(png|jpe?g|webp)$/i)
          );

          collectedPacks.push({
            id: `gh-file-${item.sha.slice(0, 8)}`,
            title: customTitle,
            titleEn: baseName,
            section,
            category,
            categoryFa,
            downloadsCount: 0,
            rating: 5.0,
            fileSize: formatBytes(item.size),
            version: 'v1.0',
            updatedDate: 'تازه اضافه شده',
            itemsCount: '۱ فایل آماده',
            format: [item.name.split('.').pop()?.toUpperCase() || 'ZIP'],
            software: section === 'editor' ? ['Premiere Pro', 'After Effects'] : ['OBS Studio', 'Streamlabs'],
            thumbnail: matchingImg?.download_url || DEFAULT_COVERS[category] || DEFAULT_COVERS[section],
            previewImages: matchingImg?.download_url ? [matchingImg.download_url] : [DEFAULT_COVERS[section]],
            description: `پک آماده دانلودی ${customTitle} - دریافت مستقیم از مخزن گیت‌هاب.`,
            features: ['لینک دانلود مستقیم و پرسرعت', 'فرمت فشرده استاندارد'],
            installGuide: ['فایل دانلود شده را اکسترکت کنید.'],
            tags: [section === 'editor' ? 'ادیت' : 'استریم', categoryFa],
            githubTag: 'main',
            githubFilename: item.name,
            directDownloadUrl: item.download_url || `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${item.path}`
          });
        }
      }
    };

    // Parallel fetch for packs/editor and packs/streamer
    await Promise.allSettled([
      processSection('packs/editor', 'editor'),
      processSection('packs/streamer', 'streamer'),
    ]);

    // If nothing found in packs/editor or packs/streamer, try checking general 'packs' folder
    if (collectedPacks.length === 0) {
      const generalItems = await fetchGitHubDirectory('packs');
      if (generalItems && generalItems.length > 0) {
        for (const it of generalItems) {
          if (it.name.toLowerCase() === 'editor' || it.name.toLowerCase() === 'streamer') continue;
          // treat as editor or streamer based on name
          const sec: SectionType = (it.name.includes('stream') || it.name.includes('obs')) ? 'streamer' : 'editor';
          if (it.type === 'file' && it.name.match(/\.(zip|rar|7z)$/i)) {
            collectedPacks.push({
              id: `gh-pack-${it.name}`,
              title: cleanTitle(it.name),
              titleEn: it.name,
              section: sec,
              category: 'assets',
              categoryFa: 'پک دانلودی',
              downloadsCount: 0,
              rating: 5.0,
              fileSize: formatBytes(it.size),
              version: 'v1.0',
              updatedDate: 'مستقیم از مخزن',
              itemsCount: '۱ فایل',
              format: ['ZIP'],
              software: ['کلیه نرم‌افزارها'],
              thumbnail: DEFAULT_COVERS[sec],
              previewImages: [DEFAULT_COVERS[sec]],
              description: `فایل دانلودی ${it.name} از مخزن گیت‌هاب ویدوکس`,
              features: ['دانلود مستقیم از گیت‌هاب'],
              installGuide: ['فایل را استخراج نمایید.'],
              tags: ['مخزن', 'گیت‌هاب'],
              githubTag: 'main',
              githubFilename: it.name,
              directDownloadUrl: it.download_url || `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${it.path}`
            });
          }
        }
      }
    }

    if (collectedPacks.length > 0) {
      localStorage.setItem(CACHE_KEY, JSON.stringify(collectedPacks));
      localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
      return { packs: collectedPacks, source: 'github-live' };
    }

    // Try reading cached if any
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return { packs: parsed, source: 'cache' };
        }
      } catch {
        // ignore
      }
    }

    return { packs: [], source: 'empty' };
  } catch (err: any) {
    console.error('Error fetching live packs from GitHub:', err);
    // Fallback to cache if available
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        return { packs: parsed, source: 'cache', error: err.message };
      } catch {
        // ignore
      }
    }
    return { packs: [], source: 'empty', error: err.message };
  }
}
