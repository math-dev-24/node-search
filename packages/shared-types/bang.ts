export interface Bang {
    id: string;
    name: string;
    icon: string;
    type: 'redirect' | 'filter';
    trigger: string;
    description: string;
    url?: string;
    engine?: string;
}