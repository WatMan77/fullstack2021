/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import express from 'express';
import patientService from '../service/patientService';
import { NewEntry, NewPatientEntry, Patient } from '../types';
import toNewPatientEntry from '../utils';

const router = express.Router();

router.get('/:id', (_req, res) => {
  const patient: Patient | undefined = patientService.findPatientId(_req.params.id);
  if(!patient){
    res.status(400).send('Patient not found');
    return;
  }
  res.send(patient);
});

router.get('/', (_req, res) => {
  const patients = patientService.getPatients();
  console.log('Found patients', patients.map(x => x.entries));
  res.send(patients);
});

router.post('/:id/entries', (_req, res) => {
  try {
  const info: NewEntry = _req.body;
  const addedEntry = patientService.addEntry(info, _req.params.id);
  console.log('Entry added', addedEntry);
  res.json(addedEntry);
  } catch (e) {
    res.send(`Error: ${e.message}`);
  }
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