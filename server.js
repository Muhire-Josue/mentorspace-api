import express from 'express';
import routes from './src/routes/router';

const app = express();
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(routes);

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`server running on port ${PORT}`));

export default app;
