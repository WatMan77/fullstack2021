import { Field } from 'formik';
import React from 'react';
import { Form } from 'semantic-ui-react';
import { NewEntryType } from '../types';

export type EntryOptions = {
  value: NewEntryType,
  label: string
};

type SelectFieldProps = {
  name: string,
  label: string,
  options: EntryOptions[]
};

export const SelectEntryTypeField = ({
  name,
  label,
  options
}: SelectFieldProps) => (
  <Form.Field>
    <label>{label}</label>
    <Field as="select" name={name} className="ui dropdown">
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label || option.value}
        </option>
      ))}
    </Field>
  </Form.Field>
);