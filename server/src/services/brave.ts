import { Result, Item } from "../../../packages/shared-types/result";
import type { Query } from "../../../packages/shared-types/query";
import { SearchEngine } from '../interfaces/SearchEngine';
import * as cheerio from 'cheerio';

export class Brave implements SearchEngine {
    name = 'Brave';
    url: string

    constructor() {
        this.url = 'https://search.brave.com/search'
    }

    public async search(query: Query, engines?: string[]): Promise<Result> {
        const headers = {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
            "Accept-Encoding": "gzip, deflate, br",
            "DNT": "1",
            "Connection": "keep-alive",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }

        try {
            let searchQuery = query.search;
            
            // Ajouter les filtres spécifiques selon les engines
            if (engines?.includes('reddit')) {
                searchQuery = `site:reddit.com ${query.search}`;
            }
            
            // Construire l'URL avec les paramètres
            const params = new URLSearchParams({
                q: searchQuery,
                source: 'web'
            });

            // Ajouter les filtres de date si spécifiés
            if (query.dateFilter && query.dateFilter !== 'any') {
                const dateFilters: Record<string, string> = {
                    'day': '1d',
                    'week': '1w', 
                    'month': '1m',
                    'year': '1y'
                };
                const filterValue = dateFilters[query.dateFilter];
                if (filterValue) {
                    params.append('tf', filterValue);
                }
            }
            
            const searchUrl = `${this.url}?${params.toString()}`;
            const res = await fetch(searchUrl, {
                headers,
                method: "GET"
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const html = await res.text();
            const $ = cheerio.load(html);
            const items: Item[] = [];

            // Debug: Log les premiers sélecteurs trouvés
            console.log('Brave search - URL:', searchUrl);
            console.log('Brave search - HTML length:', html.length);
            console.log('Brave search - .snippet count:', $('.snippet').length);
            console.log('Brave search - div count:', $('div').length);

            // Brave utilise une structure différente pour les résultats
            $('.snippet').each((index, element) => {
                const $result = $(element);
                const titleElement = $result.find('.snippet-title a');
                const urlElement = $result.find('.snippet-url');
                const descriptionElement = $result.find('.snippet-description');
                
                const title = titleElement.text().trim();
                const url = titleElement.attr('href') || urlElement.text().trim() || '';
                const description = descriptionElement.text().trim();

                if (title && url) {
                    // Tentative d'extraction de date depuis les métadonnées ou le contenu
                    const metaElement = $result.find('.snippet-meta, .snippet-date');
                    let extractedDate: Date | null = null;
                    
                    if (metaElement.length > 0) {
                        const dateText = metaElement.text().trim();
                        // Recherche de patterns de date dans le texte
                        const dateMatch = dateText.match(/(\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2}|\d+ (day|week|month|year)s? ago)/i);
                        if (dateMatch) {
                            const parsedDate = new Date(dateMatch[0]);
                            if (!isNaN(parsedDate.getTime())) {
                                extractedDate = parsedDate;
                            }
                        }
                    }
                    
                    items.push({
                        id: `brave_${index}`,
                        title,
                        url: url.startsWith('//') ? `https:${url}` : url,
                        description: description || '',
                        engine: 'brave',
                        publishedDate: null,
                        extractedDate: extractedDate || new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
                    });
                }
            });

            // Si pas de résultats avec .snippet, essayer d'autres sélecteurs
            if (items.length === 0) {
                console.log('Brave search - Trying alternative selectors...');
                
                // Essayer plusieurs sélecteurs alternatifs
                const selectors = [
                    'div[data-type="web"]',
                    '.result',
                    '.fdb',
                    'article',
                    '[data-testid="result"]',
                    '.web-result'
                ];
                
                for (const selector of selectors) {
                    const elements = $(selector);
                    console.log(`Brave search - ${selector} count:`, elements.length);
                    
                    if (elements.length > 0) {
                        elements.each((index, element) => {
                            const $result = $(element);
                            
                            // Essayer plusieurs combinaisons pour le titre
                            const titleSelectors = ['a h3', '.title a', 'h3 a', 'a[data-testid="result-title"]', '.snippet-title a', 'h3'];
                            let titleElement = $();
                            let title = '';
                            
                            for (const titleSel of titleSelectors) {
                                titleElement = $result.find(titleSel).first();
                                title = titleElement.text().trim();
                                if (title) break;
                            }
                            
                            // Essayer plusieurs combinaisons pour la description
                            const descSelectors = ['.description', '.snippet-description', 'p', '.snippet', '[data-testid="result-description"]'];
                            let description = '';
                            
                            for (const descSel of descSelectors) {
                                description = $result.find(descSel).first().text().trim();
                                if (description) break;
                            }
                            
                            // Essayer plusieurs combinaisons pour l'URL
                            const urlSelectors = ['cite', '.url', '.domain', 'a'];
                            let url = titleElement.attr('href') || '';
                            
                            if (!url) {
                                for (const urlSel of urlSelectors) {
                                    url = $result.find(urlSel).first().text().trim() || $result.find(urlSel).first().attr('href') || '';
                                    if (url) break;
                                }
                            }

                            if (title && url) {
                                console.log(`Brave search - Found result: ${title.substring(0, 50)}...`);
                                items.push({
                                    id: `brave_${index}`,
                                    title,
                                    url: url.startsWith('//') ? `https:${url}` : url,
                                    description: description || '',
                                    engine: 'brave',
                                    publishedDate: null,
                                    extractedDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
                                });
                            }
                        });
                        
                        if (items.length > 0) break; // Si on a trouvé des résultats, on s'arrête
                    }
                }
                
                console.log(`Brave search - Total results found: ${items.length}`);
            }

            // Trier les résultats si demandé
            if (query.sortBy === 'date') {
                items.sort((a, b) => {
                    const dateA = a.extractedDate || a.publishedDate;
                    const dateB = b.extractedDate || b.publishedDate;
                    
                    if (!dateA && !dateB) return 0;
                    if (!dateA) return 1;
                    if (!dateB) return -1;
                    
                    return dateB.getTime() - dateA.getTime();
                });
            }

            return {
                datas: items
            };

        } catch (error) {
            console.error('Brave search error:', error);
            return {
                datas: []
            };
        }
    }
}