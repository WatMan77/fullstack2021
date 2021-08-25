import patientData from '../../data/patients';
import { Patient, noSsnPatient, NewPatientEntry, Entry, NewEntry } from '../types';
import {v1 as uuid} from 'uuid';

const patients: Array<Patient> = patientData;

const getPatients = (): Array<noSsnPatient> => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation, entries}) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
    entries
  }));
};

const findPatientId = (id: string): Patient | undefined => {
  return patients.find(x => x.id === id);
};

const addPatient = (patient: NewPatientEntry): Patient => {
  const newPatient: Patient = {
    id: uuid(),
    ...patient,
  };
  patients.push(newPatient);
  return newPatient;
};

const addEntry = (entry: NewEntry, id: string): Entry => {
  const patient: Patient | undefined = patients.find(x => x.id === id);
  if(!patient){
    throw new Error('Patient not found');
  }
  const addedEntry: Entry = {
    ...entry,
    id: uuid(),
  } as Entry;
  patient.entries.push(addedEntry);
  return addedEntry;
};

export default {
  getPatients,
  addPatient,
  findPatientId,
  addEntry
};