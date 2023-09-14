import {

    GET_SUBJECTS_SUCCESS,
    GET_SUBJECTS_FAIL,
    GET_GENERAL_PHASE_SUBJECTS_SUCCESS,
    GET_GENERAL_PHASE_SUBJECTS_FAIL,
    GET_MODALITY_SUBJECTS_SUCCESS,
    GET_MODALITY_SUBJECTS_FAIL,
    GET_SUBJECT_SUCCESS,
    GET_SUBJECT_FAIL,

} from './types';

import axios from 'axios';
import { API_URL } from '../../routers/Api';
const END_POINT = `${ API_URL }/api/subject/`;


export const get_subjects = ( ) => async(dispatch) =>{
    const config = {
        headers: {
            'Accept': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        }
    };

    try {
        
        const res = await axios.get( `${END_POINT}`, config);
        if (res.status === 200) {

            dispatch({
                type: GET_SUBJECTS_SUCCESS,
                payload: res.data
            });
            return
            
        } else {
            
            dispatch({ type: GET_SUBJECTS_FAIL }); 
        }



    } catch (error) {
        dispatch({ type: GET_SUBJECTS_FAIL }); 
    }


}

export const get_general_phase_subjects = ( ) => async (dispatch) => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        },
        params: {
            phase: 'Fase General'
        }
    };

    try {

        const res = await axios.get( `${END_POINT}`, config);
    
        if (res.status === 200) {

            dispatch({
                type: GET_GENERAL_PHASE_SUBJECTS_SUCCESS,
                payload: res.data
            });

            
        } else {
            dispatch({
                type: GET_GENERAL_PHASE_SUBJECTS_FAIL
            });
        }

    } catch(err){
        dispatch({
            type: GET_GENERAL_PHASE_SUBJECTS_FAIL
        });
    }

}


export const get_modality_subjects = ( modality ) => async (dispatch) => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        },
        params: {
            modality: modality
        }
    };

    try {

        const res = await axios.get( `${END_POINT}`, config);
    
        if (res.status === 200) {

            dispatch({
                type: GET_MODALITY_SUBJECTS_SUCCESS,
                payload: res.data
            });

            
        } else {
            dispatch({
                type: GET_MODALITY_SUBJECTS_FAIL
            });
        }

    } catch(err){
        dispatch({
            type: GET_MODALITY_SUBJECTS_FAIL
        });
    }

}