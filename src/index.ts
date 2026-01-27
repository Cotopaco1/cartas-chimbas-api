import express, { Express, Request, Response } from 'express';

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API de Cartas Chimbas' });
});

app.get('/users', (req: Request, res: Response) => {
    res.json({
        user : {
            name : 'Jairo urbina',
            lvl : 100
        }
    })
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
