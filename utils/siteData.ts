// utils/siteData.ts

// SVG-ul original a fost înlocuit cu un dreptunghi roșu pentru a marca vizual
// zona cu probleme, ca parte a procesului de diagnosticare.
const staticSvgLogo = '<svg width="190" height="32" viewBox="0 0 190 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="190" height="32" fill="red" /></svg>';

export const fallbackLogoUri = `data:image/svg+xml;base64,${btoa(staticSvgLogo)}`;