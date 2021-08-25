import {  Field, Form, Formik } from 'formik';
import React from 'react';
import { Button, Grid } from 'semantic-ui-react';
import { DiagnosisSelection, TextField } from '../AddPatientModal/FormField';
import { useStateValue } from '../state';
import { HospitalEntry } from '../types';

type NewHospitalEntry = Omit<HospitalEntry, 'id'>;

interface Props {
  onSubmit: (values: NewHospitalEntry) => void;
  onCancel: () => void;
}


const HospitalEntryComponent = ({ onSubmit, onCancel}: Props) => {

  const [{diagnoses}] = useStateValue();

  return(
    <Formik initialValues={{
      description: '',
      date: '',
      specialist: '',
      discharge: {
        criteria: '',
        date: '',
      },
      diagnosisCodes: [], // <--- Apparently this one allows the initialization of all the other values
      type: 'Hospital',
    }}
    onSubmit={onSubmit}
    validate={values => {
      const requiredError = "Field is required";
      const errors: { [field: string]: string } = {};
      if(!values.type){
        errors.type = requiredError;
      }
      if(!values.description || values.description === ''){
        errors.description = requiredError;
      }
      if(!values.date){
        errors.date = requiredError;
      }
      if(!values.specialist){
        errors.specialist = requiredError;
      }
      if(!values.discharge || !values.discharge.criteria || !values.discharge.date){
        errors.discharge = requiredError;
      }
      return errors;
    }}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched}) => {
        return(
          <Form className='form ui'>
            <Field 
              label="Descritpion"
              placeholder="Description"
              name='description'
              component={TextField}
              />
              <Field 
              label='Date'
              placeholder='YYYY-MM-DD'
              name='date'
              component={TextField}
              />
              <Field 
              label='Specialist'
              placeholder='Specialist'
              name='specialist'
              component={TextField}            
              />
              {/* Unfortunately, error does not show up on Discharge, but they still are required */}
              <Field 
                label='Discharge date'
                placeholder='YYYY-MM-DD'
                name='discharge.date'
                component={TextField}
              />
              <Field 
                label='Discharge Criteria'
                placeholder='Criteria'
                name='discharge.criteria'
                component={TextField}
              />
            <DiagnosisSelection
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            diagnoses={Object.values(diagnoses)}
          /> 
            <Grid>
              <Grid.Column floated='left' width={5}>
                <Button type='button' onClick={onCancel} color='red'>
                  Cancel
                </Button>
              </Grid.Column>
              <Grid.Column floated="right" width={5}>
                <Button
                type="submit"
                floated="right"
                color="green"
                disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid.Column>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default HospitalEntryComponent;