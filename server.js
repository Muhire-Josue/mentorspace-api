import express from 'express';
import swaggerUi from 'swagger-ui-express';
import routes from './server/routes/router';
import swaggerDocument from './api-docs-swagger.json';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(routes);
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        message: err.message,
        error: err.status,
    });
    next();
});

app.listen(PORT, () => console.log(`server running on port ${PORT}`));

export default app;
