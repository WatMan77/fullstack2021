export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other"
}

export interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnosis['code']>;
}

interface Discharge {
  date: string,
  criteria: string,
}

export interface HospitalEntry extends BaseEntry {
  type: 'Hospital',
  discharge: Discharge
}

interface SickLeave {
  startDate: string,
  endDate: string,
}

export interface OccupationalHealthcareEntry extends BaseEntry {
  type: 'OccupationalHealthcare',
  employerName: string,
  sickLeave?: SickLeave,
}

export interface HealthCheck extends BaseEntry {
  type: 'HealthCheck',
  healthCheckRating: number,
}

export type Entry = HospitalEntry | OccupationalHealthcareEntry | HealthCheck;
export type NewEntry = Omit<HospitalEntry, 'id'> | Omit<OccupationalHealthcareEntry, 'id'> | Omit<HealthCheck, 'id'>;

export enum NewEntryType {
  Hospital = 'Hospital',
  Occupation = 'OccupationalHealthcare',
  HealthCheck = 'HealthCheck'
}


export interface Patient {
  id: string;
  name: string;
  occupation: string;
  gender: Gender;
  ssn?: string;
  dateOfBirth?: string;
  entries: Entry[]
}