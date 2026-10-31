import React from 'react';
import { X, ShieldCheck, FileText } from 'lucide-react';
import { useLocale } from '../../context/LocaleContext';

interface LegalModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  const { t } = useLocale();

  if (!type) return null;

  const isPrivacy = type === 'privacy';
  const title = isPrivacy ? t.legal.privacyTitle : t.legal.termsTitle;
  const updated = isPrivacy ? t.legal.privacyUpdated : t.legal.termsUpdated;
  const content = isPrivacy ? t.legal.privacyContent : t.legal.termsContent;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-xl bg-white dark:bg-[#0d121c] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              {isPrivacy ? <ShieldCheck className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                {title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{updated}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="py-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line space-y-4 max-h-[60vh] overflow-y-auto">
          <p>{content}</p>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 text-xs text-slate-500 dark:text-slate-400">
            <strong>Epic Optimize</strong> • Orbit Mustakim Tower, Jatrabari, Dhaka 1236, Bangladesh
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            {t.legal.close}
          </button>
        </div>
      </div>
    </div>
  );
};
