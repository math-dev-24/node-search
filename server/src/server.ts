import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173/',
    credentials: true,
}));

app.use(express.json)


app.get('/', (req, res) => res.send('Hello World!'));

app.use("/search", (req, res) => {
    const query = req.query.query as string;

    res.json({
        datas: [
            {
                id: 1,
                title: "Titre 1",
                description: "Description 1",
                image: "https://picsum.photos/200/300",
                link: "https://www.google.com"
            }
        ]
    })
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