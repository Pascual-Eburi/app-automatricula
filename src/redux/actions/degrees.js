import {

    GET_DEGREES_SUCCESS, 
    GET_DEGREES_FAIL, 
    
    GET_MODALITY_DEGREES_SUCCESS, 
    GET_MODALITY_DEGREES_FAIL, 
    
    GET_DEGREE_SUCCESS,
    GET_DEGREE_FAIL,

} from './types';

import axios from 'axios';
import { API_URL } from '../../routers/Api';
const END_POINT = `${ API_URL }/api/degree/`;


export const get_degrees = ( ) => async(dispatch) =>{
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
                type: GET_DEGREES_SUCCESS,
                payload: res.data
            });
            return
            
        } else {
            
            dispatch({ type: GET_DEGREES_FAIL }); 
        }



    } catch (error) {
        dispatch({ type: GET_DEGREES_FAIL }); 
    }


}


export const get_modality_degrees = ( modality ) => async (dispatch) => {
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
                type: GET_MODALITY_DEGREES_SUCCESS,
                payload: res.data
            });

            
        } else {
            dispatch({
                type: GET_MODALITY_DEGREES_FAIL
            });
        }

    } catch(err){
        dispatch({
            type: GET_MODALITY_DEGREES_FAIL
        });
    }

}