import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { Duckduckgo } from './services/duckduckgo';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const duckduckgo = new Duckduckgo();

app.use(helmet());

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json())


app.get('/', (req, res) => res.send('Hello World!'));

app.get("/search", async (req, res) => {
    try {
        const searchTerm = req.query.query as string;
        const enginesParam = req.query.engines as string;
        const dateFilter = req.query.dateFilter as string;
        const sortBy = req.query.sortBy as string;
        
        if (!searchTerm) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }

        const engines = enginesParam ? enginesParam.split(',') : undefined;
        const searchQuery = {
            search: searchTerm,
            bangs: [],
            dateFilter: dateFilter as 'any' | 'day' | 'week' | 'month' | 'year' || 'any',
            sortBy: sortBy as 'relevance' | 'date' || 'relevance'
        };
        
        const result = await duckduckgo.search(searchQuery, engines);
        return res.json(result);
    } catch (error) {
        console.error('Search error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})



app.use('*', (req, res) => res.status(404).send('Not Found') );


app.listen(PORT, () => {
    console.log('\n🚀 ===============================');
    console.log('🔍 SERVEUR BACKEND DÉMARRÉ');
    console.log('🚀 ===============================');
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`🎯 Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
    console.log('🚀 ===============================\n');
});

process.on('SIGINT', () => {
    console.log('\n🛑 Arrêt du serveur backend...');
    process.exit(0);
});