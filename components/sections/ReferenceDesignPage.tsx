import { readFileSync } from 'node:fs';
import path from 'node:path';
import Script from 'next/script';
import { messagesData } from '../../data/company';

type TranslationTree = string | TranslationTree[] | { [key: string]: TranslationTree };

const referenceHtml = readFileSync(
  path.join(process.cwd(), 'data', 'epic-optimize-design.html'),
  'utf8',
);

const styles = referenceHtml.match(/<style\b[^>]*>([\s\S]*?)<\/style>/i)?.[1] ?? '';
const bodyMarkup = referenceHtml.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? '';
const inlineScript = bodyMarkup.match(/<script\b[^>]*>([\s\S]*?)<\/script>/i)?.[1] ?? '';
const englishMarkup = bodyMarkup.replace(/\s*<script\b[^>]*>[\s\S]*?<\/script>\s*/i, '');

const banglaMessages = JSON.parse(
  readFileSync(path.join(process.cwd(), 'data', 'messages', 'bn.json'), 'utf8'),
) as TranslationTree;

const localizedInlineScript = inlineScript.replace(
  /const i18nData = \{[\s\S]*?\n\};/,
  `const i18nData = ${JSON.stringify(messagesData)};`,
);

if (inlineScript && localizedInlineScript === inlineScript) {
  throw new Error('Unable to synchronize the page language switcher with the translation files.');
}

const localeInitializationPattern = /let currentLocale = hasExplicitLocale[\s\S]*?;\s*let currentTheme =/;
const localeInitializedScript = localizedInlineScript.replace(
  localeInitializationPattern,
  "let currentLocale = '__LOCALE__';\n  let currentTheme =",
);

if (localizedInlineScript && localeInitializedScript === localizedInlineScript) {
  throw new Error('Unable to initialize the page language from its locale route.');
}

const windowsDecoder = new TextDecoder('windows-1252');
const reverseCp1252 = new Map<string, number>();
for (let byte = 0; byte < 256; byte += 1) {
  reverseCp1252.set(windowsDecoder.decode(Uint8Array.of(byte)), byte);
}

function repairMojibake(value: string) {
  if (!/[àâ]/.test(value)) return value;
  const bytes: number[] = [];
  for (const character of value) {
    const byte = reverseCp1252.get(character);
    if (byte !== undefined) bytes.push(byte);
    else bytes.push(...new TextEncoder().encode(character));
  }
  return new TextDecoder('utf-8').decode(Uint8Array.from(bytes));
}

function escapeHtml(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function getTranslation(key: string) {
  let value: TranslationTree | undefined = banglaMessages;
  for (const part of key.split('.')) {
    if (Array.isArray(value)) {
      if (!/^\d+$/.test(part)) return undefined;
      value = value[Number(part)];
    } else if (value && typeof value === 'object' && part in value) {
      value = value[part];
    } else {
      return undefined;
    }
  }
  return typeof value === 'string' ? value : undefined;
}

function escapeAttribute(value: string) {
  return escapeHtml(value).replaceAll('"', '&quot;');
}

function renderLocale(markup: string, locale: 'en' | 'bn') {
  if (locale === 'en') return markup;
  const translatedMarkup = markup.replace(
    /(<([\w-]+)\b[^>]*\bdata-i18n="([^"]+)"[^>]*>)([\s\S]*?)(<\/\2>)/gi,
    (element, openTag: string, _tagName: string, key: string, _oldText: string, closeTag: string) => {
      const translation = getTranslation(key);
      return translation ? `${openTag}${escapeHtml(translation)}${closeTag}` : element;
    },
  );
  return translatedMarkup.replace(
    /(<[\w-]+\b[^>]*\bdata-i18n-(placeholder|title|aria-label)="([^"]+)"[^>]*>)/gi,
    (element, openTag: string, attribute: string, key: string) => {
      const translation = getTranslation(key);
      if (!translation) return element;
      return openTag.replace(
        new RegExp(`\\b${attribute}="[^"]*"`, 'i'),
        `${attribute}="${escapeAttribute(translation)}"`,
      );
    },
  );
}

const initializedScript = localeInitializedScript
  .replace(/"((?:\\.|[^"\\])*)"/g, (literal) => {
    try {
      const value = JSON.parse(literal) as string;
      if (!/[àâ]/.test(value)) return literal;
      return JSON.stringify(repairMojibake(value));
    } catch {
      return literal;
    }
  })
  .replace(
    "document.addEventListener('DOMContentLoaded', () => {",
    'const initEpicDesign = () => {',
  )
  .replace(
    /\}\);\s*$/,
    '};\nif (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initEpicDesign, { once: true }); else initEpicDesign();',
  );

export function ReferenceDesignPage({ locale = 'en' }: { locale?: 'en' | 'bn' }) {
  const renderedMarkup = renderLocale(englishMarkup, locale);
  const script = initializedScript.replace('__LOCALE__', locale);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div dangerouslySetInnerHTML={{ __html: renderedMarkup }} />
      <Script
        id="epic-optimize-interactions"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: script }}
      />
    </>
  );
}
