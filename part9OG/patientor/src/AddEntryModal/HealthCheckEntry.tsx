import { Field, Form, Formik } from 'formik';
import React from 'react';
import { Button, Grid } from 'semantic-ui-react';
import {  DiagnosisSelection, NumberField, TextField } from '../AddPatientModal/FormField';
import { useStateValue } from '../state';
import {  HealthCheck } from '../types';

type NewHealthCheckEntry = Omit<HealthCheck, 'id'>;

interface Props {
  onSubmit: (values: NewHealthCheckEntry) => void;
  onCancel: () => void;
}

const HealthCheckEntryComponent = ({ onSubmit, onCancel}: Props) => {

  const [{diagnoses}] = useStateValue();

  return(
    <Formik initialValues={{
      description: '',
      date: '',
      specialist: '',
      healthCheckRating: 0,
      diagnosisCodes: [], // <--- Apparently this one allows the initialization of all the other values
      type: 'HealthCheck',
    }}
    onSubmit={onSubmit}
    validate={values => {
      const requiredError = "Field is required";
      const errors: { [field: string]: string } = {};
      if(!values.type){
        errors.type = requiredError;
      }
      if(!values.description){
        errors.description = requiredError;
      }
      if(!values.date || !Date.parse(values.date)){
        errors.date = 'Proper date is required';
      }
      if(!values.specialist){
        errors.specialist = requiredError;
      }
      if(!values.healthCheckRating){
        errors.healthCheckRating = requiredError;
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
              <Field
                label="healthCheckRating"
                name="healthCheckRating"
                component={NumberField}
                min={0}
                max={3}
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

export default HealthCheckEntryComponent;