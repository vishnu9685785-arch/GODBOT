import React, { useState } from 'react';
import {
  Check,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  FileCode,
  GitBranch,
  Globe,
  MoreVertical,
  Smartphone,
  Sparkles,
  X,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface AndroidDownloadModalProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidDownloadModal: React.FC<AndroidDownloadModalProps> = ({
  lang,
  isOpen,
  onClose,
}) => {
  const t = translations[lang];
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);
  const [githubRepo, setGithubRepo] = useState('');

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadAppFile = () => {
    const packageConfig = {
      package_name: 'com.looplive.app',
      application_name: 'LoopLive 24/7',
      short_name: 'LoopLive',
      version_name: '1.0.0',
      version_code: 1,
      start_url: currentUrl,
      theme_color: '#09090b',
      background_color: '#09090b',
      display_mode: 'standalone',
      orientation: 'portrait',
      categories: ['multimedia', 'video', 'tools'],
      github_workflow: '.github/workflows/build-apk.yml',
      gradle_target: ':app:assembleDebug',
      apk_output_path: 'app/build/outputs/apk/debug/app-debug.apk',
      export_timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(packageConfig, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'LoopLive-247-Android-Config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadWorkflowFile = () => {
    // Allows user to download build-apk.yml directly on mobile phone
    fetch('/.github/workflows/build-apk.yml')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load workflow');
        return res.text();
      })
      .then((content) => {
        const blob = new Blob([content], { type: 'text/yaml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'build-apk.yml';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      })
      .catch(() => {
        // Fallback direct download
        window.open('/.github/workflows/build-apk.yml', '_blank');
      });
  };

  const handleOpenGitHub = () => {
    const cleanRepo = githubRepo.trim().replace(/^https?:\/\/github\.com\//, '');
    if (cleanRepo) {
      window.open(`https://github.com/${cleanRepo}/releases`, '_blank');
    } else {
      window.open('https://github.com', '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                {t.androidInstallTitle}
              </h3>
              <p className="text-[11px] text-zinc-400">
                Direct APK & WebAPK Installation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Main App Header Card */}
          <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 p-0.5 flex items-center justify-center overflow-hidden shadow-md">
                  <img src="/looplive_logo.svg" alt="LoopLive Icon" className="w-full h-full object-cover rounded-xl" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>LoopLive 24/7</span>
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                      Android APK Ready
                    </span>
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {t.androidInstallDesc}
                  </p>
                </div>
              </div>
            </div>

            {/* Direct 1-tap installation if browser supports WebAPK prompt */}
            {isInstallable && (
              <button
                onClick={install}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all active:scale-[0.98]"
              >
                <Download className="w-4 h-4" />
                <span>{t.directInstall}</span>
              </button>
            )}

            {isInstalled && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t.appInstalled}</span>
              </div>
            )}
          </div>

          {/* 🌟 Direct GitHub APK Download Card */}
          <div className="p-4 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 rounded-xl border border-blue-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <GitBranch className="w-4 h-4" />
                </div>
                <h5 className="text-xs font-bold text-white">
                  {t.githubApkTitle}
                </h5>
              </div>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-950 border border-blue-500/30 text-blue-300">
                GitHub Actions
              </span>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              {t.githubApkDesc}
            </p>

            <div className="p-3 bg-zinc-950/80 rounded-lg border border-zinc-800 space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-blue-600/30 text-blue-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                <span className="text-[11px] text-zinc-300">{t.githubStep1}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-blue-600/30 text-blue-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                <span className="text-[11px] text-zinc-300">{t.githubStep2}</span>
              </div>
            </div>

            {/* Quick Repo Link & Action Buttons */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={githubRepo}
                  onChange={(e) => setGithubRepo(e.target.value)}
                  placeholder="username/repo-name (e.g. your-name/looplive)"
                  className="flex-1 bg-zinc-950 border border-zinc-700/80 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 font-mono"
                />
                <button
                  onClick={handleOpenGitHub}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{t.openGitHubReleases}</span>
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={handleDownloadWorkflowFile}
                  className="text-[11px] text-blue-400 hover:text-blue-300 underline flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  <span>{t.downloadWorkflowFile}</span>
                </button>
                <span className="text-[10px] text-zinc-500 font-mono">
                  .github/workflows/build-apk.yml
                </span>
              </div>
            </div>
          </div>

          {/* Android Chrome 3-Step Instant WebAPK Guide */}
          <div className="space-y-2">
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {lang === 'en'
                  ? 'Instant Phone Installation (Without GitHub)'
                  : 'बिना गिटहब के तुरंत फोन पर इंस्टॉल करें'}
              </span>
            </h5>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-zinc-950/80 rounded-xl border border-zinc-800 flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-zinc-800 text-zinc-300 font-mono font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </div>
                <div>
                  <p className="font-semibold text-zinc-200">
                    {lang === 'en' ? 'Open in Google Chrome or Samsung Internet' : 'गूगल क्रोम या सैमसंग इंटरनेट में खोलें'}
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-0.5 flex items-center gap-1">
                    <span>{t.androidStep1}</span>
                    <MoreVertical className="w-3 h-3 text-zinc-300 inline" />
                  </p>
                </div>
              </div>

              <div className="p-3 bg-zinc-950/80 rounded-xl border border-zinc-800 flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-zinc-800 text-zinc-300 font-mono font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </div>
                <div>
                  <p className="font-semibold text-zinc-200">
                    {lang === 'en' ? 'Tap "Install app"' : '"ऐप इंस्टॉल करें" पर टैप करें'}
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    {t.androidStep2}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-zinc-950/80 rounded-xl border border-zinc-800 flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-zinc-800 text-zinc-300 font-mono font-bold flex items-center justify-center shrink-0 text-xs">
                  3
                </div>
                <div>
                  <p className="font-semibold text-zinc-200">
                    {lang === 'en' ? 'Confirm Installation' : 'इंस्टॉलेशन की पुष्टि करें'}
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    {t.androidStep3}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Download App Package Configuration */}
          <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-blue-400" />
                <span>{t.downloadConfigFile}</span>
              </span>
              <button
                type="button"
                onClick={handleDownloadAppFile}
                className="px-2.5 py-1 text-[11px] font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg flex items-center gap-1.5 transition-colors border border-zinc-700/60"
              >
                <Download className="w-3 h-3" />
                <span>{lang === 'en' ? 'Save .json' : 'फ़ाइल सेव करें'}</span>
              </button>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              {t.apkBuilderInfo}
            </p>
          </div>

          {/* Copy Web Link for Android */}
          <div className="p-3 bg-zinc-950/60 border border-zinc-800 rounded-xl flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 truncate text-zinc-400">
              <Globe className="w-4 h-4 text-zinc-500 shrink-0" />
              <span className="truncate font-mono text-[11px]">{currentUrl}</span>
            </div>
            <button
              onClick={handleCopyLink}
              className="px-2.5 py-1 text-[11px] font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-md shrink-0 flex items-center gap-1 transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? (lang === 'en' ? 'Copied!' : 'कॉपी हुआ!') : (lang === 'en' ? 'Copy URL' : 'यूआरएल कॉपी')}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-zinc-800 flex justify-end bg-zinc-950/50">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
