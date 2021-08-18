/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import express from 'express';
import patientService from '../service/patientService';
import { NewPatientEntry } from '../types';
import toNewPatientEntry from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  const patients = patientService.getPatients();
  console.log('patients', patients);
  res.send(patients);
});

router.post('/', (_req, res) => {
  try {
    const daPatient: NewPatientEntry = toNewPatientEntry(_req.body);
    const newPatient = patientService.addPatient(daPatient);

    res.json(newPatient);
} catch (e) {
  res.status(400).send(e.message);
}
});

export default router;