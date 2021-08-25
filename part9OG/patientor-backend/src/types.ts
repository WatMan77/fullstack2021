export interface Diagnose {
  code: string,
  name: string,
  latin?: string
}

export interface Patient {
  id: string,
  name: string,
  dateOfBirth: string,
  ssn: string,
  gender: Gender,
  occupation: string,
  entries: Entry[]

}
export type noSsnPatient = Omit<Patient, 'ssn'>;

export type NewPatientEntry = Omit<Patient, 'id'>;

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other'
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnose['code']>;
}

export type PublicPatient = Omit<Patient, 'ssn' | 'entries' >;

interface Discharge {
  date: string,
  criteria: string,
}

interface HospitalEntry extends BaseEntry {
  type: 'Hospital',
  discharge: Discharge
}

interface SickLeave {
  startDate: string,
  endDate: string,
}

interface OccupationalHealthcareEntry extends BaseEntry {
  type: 'OccupationalHealthcare',
  employerName: string,
  sickLeave?: SickLeave,
}

interface HealthCheck extends BaseEntry {
  type: 'HealthCheck',
  healthCheckRating: number,
}

export type Entry = HospitalEntry | OccupationalHealthcareEntry | HealthCheck;

// Id is the only thing we cannot give
export type NewEntry = Omit<HospitalEntry, 'id'> | Omit<OccupationalHealthcareEntry, 'id'> | Omit<HealthCheck, 'id'>;