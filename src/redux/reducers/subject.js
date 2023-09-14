import {
  GET_SUBJECTS_SUCCESS,
  GET_SUBJECTS_FAIL,
  GET_GENERAL_PHASE_SUBJECTS_SUCCESS,
  GET_GENERAL_PHASE_SUBJECTS_FAIL,
  GET_MODALITY_SUBJECTS_SUCCESS,
  GET_MODALITY_SUBJECTS_FAIL,
  GET_SUBJECT_SUCCESS,
  GET_SUBJECT_FAIL,
} from "../actions/types";

const initialState = {
  subjects: null,
  general_phase_subjects: null,
  modality_subjects: null,
};

export default function Subject(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_SUBJECTS_SUCCESS:
      return {
        ...state,
        subjects: payload.subjects,
      };

    case GET_SUBJECTS_FAIL:
      return {
        ...state,
        subjects: null,
      };

    case GET_GENERAL_PHASE_SUBJECTS_SUCCESS:
      return {
        ...state,
        general_phase_subjects: payload.subjects,
      };

    case GET_GENERAL_PHASE_SUBJECTS_FAIL:
      return {
        ...state,
        general_phase_subjects: null,
      };

    case GET_MODALITY_SUBJECTS_SUCCESS:
      return {
        ...state,
        modality_subjects: payload.subjects,
      };

    case GET_MODALITY_SUBJECTS_FAIL:
      return {
        ...state,
        modality_subjects: null,
      };

    case GET_SUBJECT_SUCCESS:
      return {
        ...state,
        subject: payload.subject,
      };
    case GET_SUBJECT_FAIL:
      return {
        ...state,
        subject: null,
      };

    default:
      return state;
  }
}
