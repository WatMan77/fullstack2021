import { State } from "./state";
import { Diagnosis, Entry, Patient } from "../types";

export type Action =
  | {
      type: "SET_PATIENT_LIST";
      payload: Patient[];
    }
  | {
      type: "ADD_PATIENT";
      payload: Patient;
    }
  | {
    type: "SET_DIAGNOSIS_LIST";
    payload: Diagnosis[];
  }
  | {
    type: "ADD_ENTRY";
    payload: Entry,
    id: string
  };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients
        }
      };
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload
        }
      };
    case "SET_DIAGNOSIS_LIST":
      return {
        ...state,
        diagnoses: {
          ...action.payload.reduce(
            (memo, diagnosis) => ({ ...memo, [diagnosis.code]: diagnosis}),
            {}
          ),
          ...state.diagnoses
        }
      };
    case 'ADD_ENTRY':
      const patient = state.patients[action.id];
      patient.entries.push(action.payload);
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.id]: patient
        }
      };
    default:
      return state;
  }
};

// 9.17 asks to make a new action type but there is no point in that
// as adding a patient to the state will do the exact same thing as ADD_PATIENT
// unless I am missing something...
export const addPatient = (payload: Patient): Action => ({
  type: 'ADD_PATIENT',
  payload: payload
});

export const setPatientList = (payload: Patient[]): Action => ({
  type: 'SET_PATIENT_LIST',
  payload: payload,
});

export const setDiagnosisList = (payload: Diagnosis[]): Action => ({
  type: 'SET_DIAGNOSIS_LIST',
  payload: payload
});

export const addNewEntry = (payload: Entry, id: string): Action => ({
  type: 'ADD_ENTRY',
  payload: payload,
  id: id
});