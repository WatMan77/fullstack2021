import React from 'react';
import { Entry } from '../types';
import HospitalEntryComponent from './HospitalEntry';
import HealthCheckComponent from './HealthCheck';
import OccupationalComponent from './Occupation';

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
  switch(entry.type) {
    case 'Hospital':
      return <HospitalEntryComponent entry={entry}/>;
    case 'HealthCheck':
      return <HealthCheckComponent entry={entry}/>;
    case 'OccupationalHealthcare':
      return <OccupationalComponent entry={entry}/>;
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;