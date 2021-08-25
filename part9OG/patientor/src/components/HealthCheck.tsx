import React from 'react';
import { Icon, Segment } from 'semantic-ui-react';
import { useStateValue } from '../state';
import { HealthCheck } from '../types';

enum Colors {
  Yellow = 'yellow',
  Green = 'green',
  Red = 'red',
  Black = 'black',
  Blue = 'blue'
}

// For some weird reason the colors in an array string do not work. Throws an error
const setColor = (rating: number): Colors => {
  switch(rating) {
    case 0:
      return Colors.Green;
    case 1:
      return Colors.Red;
    case 2:
      return Colors.Blue;
    case 3:
      return Colors.Yellow;
    default:
      return Colors.Black;
  }
};

const HealthCheckComponent: React.FC<{ entry: HealthCheck}> = ({ entry }) => {
  const [{diagnoses},] = useStateValue();

  return (
    <Segment>
      <p>{entry.date}</p>
      <p>{entry.description}</p>
      <Icon className='heart' size='small' color={setColor(entry.healthCheckRating)} />
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

export default HealthCheckComponent;