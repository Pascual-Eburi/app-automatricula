import {
    GET_DEGREES_SUCCESS, 
    GET_DEGREES_FAIL, 
    
    GET_MODALITY_DEGREES_SUCCESS, 
    GET_MODALITY_DEGREES_FAIL, 
    
    GET_DEGREE_SUCCESS,
    GET_DEGREE_FAIL, 
  } from "../actions/types";
  
  const initialState = {
    degrees: null,
    modality_degrees: null,
    degree: null,
  };
  
  export default function Degree(state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case GET_DEGREES_SUCCESS:
        return {
          ...state,
          degrees: payload.degrees,
        };
  
      case GET_DEGREES_FAIL:
        return {
          ...state,
          degrees: null,
        };
  
      case GET_MODALITY_DEGREES_SUCCESS:
        return {
          ...state,
          modality_degrees: payload.degrees,
        };
  
      case GET_MODALITY_DEGREES_FAIL:
        return {
          ...state,
          modality_degrees: null,
        };
  
      case GET_DEGREE_SUCCESS:
        return {
          ...state,
          degree: payload.degree,
        };
      case GET_DEGREE_FAIL:
        return {
          ...state,
          degree: null,
        };
  
      default:
        return state;
    }
  }
  