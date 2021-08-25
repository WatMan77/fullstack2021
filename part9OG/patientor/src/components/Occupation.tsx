import React from 'react';
import { useStateValue } from '../state';
import { OccupationalHealthcareEntry } from '../types'; 
import { Icon, Segment } from 'semantic-ui-react';

const OccupationalComponent: React.FC<{ entry: OccupationalHealthcareEntry}> = ({ entry }) => {
  
  const [{diagnoses},] = useStateValue();

  return (
    <Segment>
      <p>{entry.date} <Icon className='stethoscope' size='large' /> </p>
      <p>{entry.description}</p>
      {entry.employerName}
      <ul>
      {entry.diagnosisCodes?.map(x =>
        <li key={x}>
          {x} {diagnoses[x].name}          
        </li>
        )}
    </ul>
    </Segment>    
  );
};

export default OccupationalComponent;