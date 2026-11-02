import { readFileSync } from 'node:fs';
import path from 'node:path';
import Script from 'next/script';

type TranslationTree = { [key: string]: string | TranslationTree };

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
  let value: string | TranslationTree = banglaMessages;
  for (const part of key.split('.')) {
    if (typeof value === 'string' || !(part in value)) return undefined;
    value = value[part];
  }
  return typeof value === 'string' ? value : undefined;
}

function renderLocale(markup: string, locale: 'en' | 'bn') {
  if (locale === 'en') return markup;
  return markup.replace(
    /(<([\w-]+)\b[^>]*\bdata-i18n="([^"]+)"[^>]*>)([\s\S]*?)(<\/\2>)/gi,
    (element, openTag: string, _tagName: string, key: string, _oldText: string, closeTag: string) => {
      const translation = getTranslation(key);
      return translation ? `${openTag}${escapeHtml(translation)}${closeTag}` : element;
    },
  );
}

const initializedScript = inlineScript
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

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div dangerouslySetInnerHTML={{ __html: renderedMarkup }} />
      <Script
        id="epic-optimize-interactions"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: initializedScript }}
      />
    </>
  );
}
