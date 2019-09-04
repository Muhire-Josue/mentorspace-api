import express from 'express';
import userRoutes from './server/routes/userRouter';
import adminRouter from './server/routes/adminRouter';
import mentorRouter from './server/routes/mentorRouter';

const app = express();

const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(userRoutes);
app.use(adminRouter);
app.use(mentorRouter);

app.listen(PORT, () => console.log(`server running on port ${PORT}`));

export default app;
