/**
 * Retourne une version simplifiée d'une URL (domaine + chemin)
 */
export const getDisplayUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname + urlObj.pathname;
  } catch {
    return url;
  }
};