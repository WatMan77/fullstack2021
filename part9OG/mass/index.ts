/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import express from 'express';
import { bmiCalcualtor } from './bmiCalculator';
import { execCalculator } from './exerciseCalculator';
const app = express();

app.use(express.json());

app.get('/bmi', (_req, res) => {
  const params = _req.query;
  if(!params.height || !params.height || Number(params.height) <= 0 || Number(params.weight) < 0){
    res.send({ error: 'malformed parameters' });
  }
  const result = bmiCalcualtor(Number(_req.query.height), Number(_req.query.weight));
  res.send(result);
});

app.post('/exercises', (_req, res) => {
  console.log('The body', _req.body);

  if(!_req.body.daily_exercises || !_req.body.target){
    res.send({ error: 'Parameters missing'});
    return;
  }
  const { daily_exercises, target } = _req.body;
  try {
    const result = execCalculator(daily_exercises, target);
    res.json(result);
    return;
  } catch (e) {
    res.send({ error: e.message});
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});