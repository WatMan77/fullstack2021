import React, { useState } from 'react';
import { Button, Modal, Segment } from 'semantic-ui-react';
import { NewEntry } from '../types';
import HospitalEntryComponent from './HospitalEntry';
import HealthCheckEntryComponent from './HealthCheckEntry';
import OccupationEntryComponent from './OccupationEntry';

interface Props {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: NewEntry) => void;
  error?: string;
}

const AddEntryModal = ({ modalOpen, onClose, onSubmit, error }: Props) => {
  const [formType, setFormType] = useState('Hospital');
  const getForm = () => {
    switch(formType) {
      case 'HealthCheck':
        console.log('Returning HealthCheck');
        return <HealthCheckEntryComponent onSubmit={onSubmit} onCancel={onClose} />;
      case 'Hospital':
        console.log('Retugning Hospital');
        return <HospitalEntryComponent onSubmit={onSubmit} onCancel={onClose} />;
      case 'OccupationalHealthCare':
        return <OccupationEntryComponent onSubmit={onSubmit} onCancel={onClose}/>;
      default:
        return <HospitalEntryComponent onSubmit={onSubmit} onCancel={onClose}/>;
    }
  };
  // Separate forms were a lot easier to handle
  // Also, separate forms don't send unnessecary data in entry types that don't need them. (Caused by initial values in Formik)
  return (
    <Modal open={modalOpen} onClose={onClose} centered={false} closeIcon>
      <Button onClick={() => setFormType('Hospital')}>Add Hospital Entry</Button>
      <Button onClick={() => setFormType('HealthCheck')}>Add Health Check Entry</Button>
      <Button onClick={() => setFormType('OccupationalHealthCare')}>Add Occupational Entry</Button>
      <Modal.Content>
        {error && <Segment inverte >{`Error: ${error}`}</Segment>}
        {getForm()}
      </Modal.Content>
    </Modal>
  );
};

export default AddEntryModal;