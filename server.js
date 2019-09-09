import express from 'express';
import routes from './server/routes/router';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(routes);
app.listen(PORT, () => console.log(`server running on port ${PORT}`));

export default app;
