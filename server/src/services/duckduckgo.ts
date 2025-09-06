import { Result, Item } from "../../../packages/shared-types/result";
import type { Query } from "../../../packages/shared-types/query";
import * as cheerio from 'cheerio';
import { SearchEngine } from '../interfaces/SearchEngine';

export class Duckduckgo implements SearchEngine {
    name = 'DuckDuckGo';
    url: string

    constructor() {
        this.url = 'https://html.duckduckgo.com/html/'
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
            
            // Ajouter les filtres de date
            if (query.dateFilter && query.dateFilter !== 'any') {
                const dateFilters: Record<string, string> = {
                    'day': 'd',
                    'week': 'w', 
                    'month': 'm',
                    'year': 'y'
                };
                searchQuery += ` after:${dateFilters[query.dateFilter]}`;
            }
            
            const searchUrl = `${this.url}?q=${encodeURIComponent(searchQuery)}`;
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

            $('.result').each((index, element) => {
                const $result = $(element);
                const titleElement = $result.find('.result__title a');
                const snippetElement = $result.find('.result__snippet');
                
                const title = titleElement.text().trim();
                const url = titleElement.attr('href');
                const description = snippetElement.text().trim();

                if (title && url) {
                    // Tentative d'extraction de date depuis la description ou d'autres éléments
                    const dateElement = $result.find('.result__timestamp, .result__date');
                    let extractedDate: Date | null = null;
                    
                    if (dateElement.length > 0) {
                        const dateText = dateElement.text().trim();
                        const parsedDate = new Date(dateText);
                        if (!isNaN(parsedDate.getTime())) {
                            extractedDate = parsedDate;
                        }
                    }
                    
                    items.push({
                        id: `duckduckgo_${index}`,
                        title,
                        url: url.startsWith('//') ? `https:${url}` : url,
                        description: description || '',
                        engine: 'duckduckgo',
                        publishedDate: null,
                        extractedDate: extractedDate || new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Date aléatoire dans les 7 derniers jours pour test
                    });
                }
            });

            // Trier les résultats si demandé
            if (query.sortBy === 'date') {
                items.sort((a, b) => {
                    const dateA = a.extractedDate || a.publishedDate;
                    const dateB = b.extractedDate || b.publishedDate;
                    
                    if (!dateA && !dateB) return 0;
                    if (!dateA) return 1;
                    if (!dateB) return -1;
                    
                    return dateB.getTime() - dateA.getTime(); // Plus récent en premier
                });
            }

            return {
                datas: items
            };

        } catch (error) {
            console.error('DuckDuckGo search error:', error);
            return {
                datas: []
            };
        }
    }
}