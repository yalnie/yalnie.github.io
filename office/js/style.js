import '@material/web/all.js';
import { officeLinks } from './links.js';

const dialog = document.getElementById('linksDialog');
const dialogTitle = document.getElementById('dialogTitle');
const dialogContent = document.getElementById('dialogContent');
const closeBtn = document.getElementById('closeDialog');

let userLang = navigator.language || 'en-US';
if (userLang.length === 2) userLang = `${userLang}-${userLang.toUpperCase()}`;

// supported languages from MAS
const supportedLangs = [
  'en-US', 'ar-SA', 'bg-BG', 'zh-CN', 'zh-TW', 'hr-HR', 'cs-CZ', 'da-DK',
  'nl-NL', 'et-EE', 'fi-FI', 'fr-FR', 'de-DE', 'el-GR', 'he-IL', 'hi-IN',
  'hu-HU', 'id-ID', 'it-IT', 'ja-JP', 'kk-KZ', 'ko-KR', 'lv-LV', 'lt-LT',
  'ms-MY', 'nb-NO', 'pl-PL', 'pt-BR', 'pt-PT', 'ro-RO', 'ru-RU', 'sr-Latn-RS',
  'sk-SK', 'sl-SI', 'es-ES', 'sv-SE', 'th-TH', 'tr-TR', 'uk-UA', 'vi-VN',
  'fr-CA', 'es-MX', 'sr-latn-CS', 'en-GB'
];

userLang = userLang.toLowerCase().split('-').map((p, i) => i ? p.toUpperCase() : p).join('-');
let effectiveLang = supportedLangs.includes(userLang) ? userLang : 'en-US';

globalThis.openDialog = (version) => {
  dialogTitle.textContent = `Microsoft Office ${version}`;

  let content = officeLinks[version] || "No links available yet.";

  content = content.replaceAll(/language=en-US/g, `language=${effectiveLang}`);
  content = content.replaceAll(/\/en-US\//g, `/${effectiveLang}/`);
  content = content.replaceAll(/\/en-us\//g, `/${effectiveLang.toLowerCase()}/`);

  let htmlContent = convertMarkdown(content);

  const langNote = `
    <hr style="margin-top:16px;margin-bottom:8px;opacity:0.3;">
    <p style="font-size:12px;opacity:0.7;text-align:right;">
      Showing links for: <strong>${effectiveLang}</strong>
      ${effectiveLang !== userLang ? `(fallback from ${userLang})` : ''}
    </p>
  `;

  dialogContent.innerHTML = htmlContent + langNote;
  dialog.show();
};

closeBtn?.addEventListener("click", () => dialog.close());

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && dialog.open) dialog.close();
});

function convertMarkdown(md) {
  let html = md.replace(/\r\n/g, '\n');

  html = html
    .replace(/^### (.*?)\s*$/gim, '<h3>$1</h3>')
    .replace(/^## (.*?)\s*$/gim, '<h2>$1</h2>')
    .replace(/^# (.*?)\s*$/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  
  const urlRegex = /(?<!href=["']|">)(https?:\/\/[^\s<]+)/gim;
  html = html.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
  
  return html
    .replace(/\n/g, '<br>')
    .replace(/(<br>){2,}/g, '<br><br>')
    .replace(/(<\/h[1-3]>)\s*<br>/gi, '$1');
}