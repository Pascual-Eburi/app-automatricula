import {

    GET_MODALITIES_SUCCESS,
    GET_MODALITIES_FAIL,
    GET_MODALITY_SUCCESS,
    GET_MODALITY_FAIL

} from './types';

import axios from 'axios';
import { API_URL } from '../../routers/Api';
const END_POINT = `${ API_URL }/api/modality/modalities`;


export const get_modalities = ( ) => async(dispatch) =>{
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
                type: GET_MODALITIES_SUCCESS,
                payload: res.data
            });
            return
            
        } else {
            
            dispatch({ type: GET_MODALITIES_FAIL }); 
        }



    } catch (error) {
        dispatch({ type: GET_MODALITIES_FAIL }); 
    }


}

export const get_modality = ( code ) => async (dispatch) => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        }
    };

    try {

        const res = await axios.get( `${END_POINT}/${code}`, config);
    
        if (res.status === 200) {
            //console.log(res.data)
            dispatch({
                type: GET_MODALITY_SUCCESS,
                payload: res.data
            });

            
        } else {
            dispatch({
                type: GET_MODALITY_FAIL
            });
        }

    } catch(err){
        dispatch({
            type: GET_MODALITY_FAIL
        });
    }

}