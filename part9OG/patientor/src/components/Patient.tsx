import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useStateValue, addPatient, addNewEntry } from '../state';
import { Patient } from '../types';
import { apiBaseUrl } from '../constants';
import { Icon, Button } from 'semantic-ui-react';
import EntryDetails from './EntryDetails';
import AddEntryModal from '../AddEntryModal';
import { Entry, NewEntry } from '../types';

const PatientPage = () => {

  const { id } = useParams<{ id: string }>();

  const [{patients}, dispatch] = useStateValue();
  // This causes a problem if we refresh on the patients page. Thinks 'patients' is undefined
  const patient: Patient = patients[id];

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewEntry = async(values: NewEntry) => {
    try {
      const {data: newEntry } = await axios.post<Entry>(`${apiBaseUrl}/patients/${id}/entries`, values);
      dispatch(addNewEntry(newEntry, id)); //addNewEntry is very wrong!
    } catch (e) {
      console.error(e.response?.data || 'Unknown Error');
    }
  };

  //Unless I/we bother to fix the above mentioned issue, there is no need to
  //separately fetch the diagnoses as they will be already in the state  
  useEffect(() => {
    const getPatient = async() => {
      try {
      const { data: patient } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
      dispatch(addPatient(patient));
      } catch (e) {
        console.log('Error in fetching a single patient:', e.message);
      }
    };
    void getPatient();
  }, [dispatch, patient.ssn]);

  return (
    <div>
      <AddEntryModal
      modalOpen={modalOpen}
      onSubmit={submitNewEntry}
      error={error}
      onClose={closeModal}
      />
      <Button onClick={() => openModal()}>Add New Entry</Button>
      <h1>Name: {patient.name}
      {patient.gender === 'male' ? <Icon className='mars' size='large'/>
      : patient.gender === 'female' ? <Icon className='venus' size='large'/>
      : <Icon className='genderless' size='large'/>}      
      </h1>
      <h2>ssn: {patient.ssn}</h2>
      <h2>occupation: {patient.occupation}</h2>
      <h2>entries:</h2>
      <ul>
        {patient.entries.map(x =>
          <li key={x.id}>
            <EntryDetails entry={x}/>
          </li>
          )}
      </ul>
    </div>
  );
};

export default PatientPage;