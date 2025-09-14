// utils/siteData.ts

// SVG-ul original a fost convertit într-un format static (fără clase Tailwind)
// și codificat în Base64 pentru a fi folosit ca un Data URI.
// Acesta servește ca imagine de rezervă pentru logo.
const staticSvgLogo = '<svg width="190" height="32" viewBox="0 0 190 32" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="0" y="24" font-family="Inter, sans-serif" font-size="22" font-weight="bold" fill="#0B5FFF">Open Road <tspan fill="#6B7280">Leasing</tspan></text></svg>';

export const fallbackLogoUri = `data:image/svg+xml;base64,${btoa(staticSvgLogo)}`;
