import type { Bang } from '../../../packages/shared-types/bang'

export const AVAILABLE_BANGS: Bang[] = [
  // Redirects
  {
    id: 'youtube',
    name: 'YouTube',
    icon: 'pi pi-video',
    type: 'redirect',
    trigger: '!yt',
    description: 'Rechercher sur YouTube',
    url: 'https://www.youtube.com/results?search_query='
  },
  {
    id: 'google',
    name: 'Google',
    icon: 'pi pi-globe',
    type: 'redirect',
    trigger: '!g',
    description: 'Rechercher sur Google',
    url: 'https://www.google.com/search?q='
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: 'pi pi-github',
    type: 'redirect',
    trigger: '!gh',
    description: 'Rechercher sur GitHub',
    url: 'https://github.com/search?q='
  },
  {
    id: 'stackoverflow',
    name: 'Stack Overflow',
    icon: 'pi pi-question-circle',
    type: 'redirect',
    trigger: '!so',
    description: 'Rechercher sur Stack Overflow',
    url: 'https://stackoverflow.com/search?q='
  },
  {
    id: 'wikipedia',
    name: 'Wikipedia',
    icon: 'pi pi-book',
    type: 'redirect',
    trigger: '!w',
    description: 'Rechercher sur Wikipedia',
    url: 'https://fr.wikipedia.org/wiki/Special:Search?search='
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    icon: 'pi pi-twitter',
    type: 'redirect',
    trigger: '!x',
    description: 'Rechercher sur X',
    url: 'https://twitter.com/search?q='
  },
  {
    id: 'reddit',
    name: 'Reddit',
    icon: 'pi pi-reddit',
    type: 'redirect',
    trigger: '!r',
    description: 'Rechercher sur Reddit',
    url: 'https://www.reddit.com/search?q='
  },
  {
    id: 'amazon',
    name: 'Amazon',
    icon: 'pi pi-shopping-cart',
    type: 'redirect',
    trigger: '!a',
    description: 'Rechercher sur Amazon',
    url: 'https://www.amazon.fr/s?k='
  },

  // Filtres (pour notre moteur de recherche)
  {
    id: 'news',
    name: 'Actualités',
    icon: 'pi pi-calendar',
    type: 'filter',
    trigger: '!news',
    description: 'Filtrer les actualités',
    engine: 'news'
  },
  {
    id: 'images',
    name: 'Images',
    icon: 'pi pi-image',
    type: 'filter',
    trigger: '!img',
    description: 'Recherche d\'images',
    engine: 'images'
  },
  {
    id: 'videos',
    name: 'Vidéos',
    icon: 'pi pi-play',
    type: 'filter',
    trigger: '!vid',
    description: 'Recherche de vidéos',
    engine: 'videos'
  },
  {
    id: 'reddit-filter',
    name: 'Reddit',
    icon: 'pi pi-reddit',
    type: 'filter',
    trigger: '!reddit',
    description: 'Filtrer les résultats de Reddit',
    engine: 'reddit'
  }
];
