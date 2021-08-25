import { Field, Form, Formik } from "formik";
import React from 'react';
import { Button, Grid } from "semantic-ui-react";
import { DiagnosisSelection, TextField } from '../AddPatientModal/FormField';
import { useStateValue } from "../state";
import { OccupationalHealthcareEntry } from "../types";

type NewOccupationEntry = Omit<OccupationalHealthcareEntry, 'id'>;

interface Props {
  onSubmit: (values: NewOccupationEntry) => void;
  onCancel: () => void;
}

const OccupationEntryComponent = ({ onSubmit, onCancel}: Props) => {

  const [{diagnoses}] = useStateValue();

  return(
    <Formik initialValues={{
      description: '',
      date: '',
      specialist: '',
      diagnosisCodes: [], // <--- Apparently this one allows the initialization of all the other values
      type: 'OccupationalHealthcare',
      employerName: '',
      sickLeave: {
        startDate: '',
        endDate: ''
      }
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
      if(!values.date || !Date.parse(values.date)){
        errors.date = 'Proper date is required';
      }
      if(!values.specialist){
        errors.specialist = requiredError;
      }
      if(!values.employerName){
        errors.specialist = requiredError;
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
                label="Employer Name"
                placeholder='Employer Name'
                name="employerName"
              />
              <Field 
                label='Sick leave start date'
                placeholder='YYYY-MM-DD'
                name='sickLeave.startDate'
                component={TextField}
              />
              <Field 
                label='Sick leave end date'
                placeholder='YYYY-MM-DD'
                name='sickLeave.endDate'
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

export default OccupationEntryComponent;