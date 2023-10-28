import express, { json } from 'express';
const app = express();
import { router } from './router.js';

app.disable('x-powered-by')
app.use(json())
app.use(express.static('public'));
app.use('/', router);

const PORT = process.env.PORT ?? 1234
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});