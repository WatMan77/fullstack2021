import express from 'express';
import cors from 'cors';
import diagnosisRouter from './routes.ts/diagnosisRouter';
import patientRouter from './routes.ts/patientRouter';

const app = express();
app.use(express.json());
app.use(cors());

app.get('/api/ping', (_req, res) => {
  console.log('Pingin!');
  res.send('pong');
});

app.use('/api/diagnosis', diagnosisRouter);
app.use('/api/patients', patientRouter);

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`);
});