import React from 'react';
import { HospitalEntry } from '../types';
import { Icon, Segment } from 'semantic-ui-react';
import { useStateValue } from '../state';


const HospitalEntryComponent: React.FC<{ entry: HospitalEntry }> = ({ entry }) => {
  
  const [{diagnoses},] = useStateValue();

  return (
  <Segment>
    {entry.date}<Icon className='user md' size='large'/>
    <p>{entry.description}</p> 
    <p>Discharge: {entry.discharge.date}</p>
    <p>Criteria: {entry.discharge.criteria}</p>
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

export default HospitalEntryComponent;