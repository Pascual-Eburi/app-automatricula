import {

    GET_INSTITUTES_SUCCESS,
    GET_INSTITUTES_FAIL,
    GET_INSTITUTE_SUCCESS,
    GET_INSTITUTE_FAIL

} from './types';

import axios from 'axios';
import { API_URL } from '../../routers/Api';
const END_POINT = `${ API_URL }/api/institute/institutes`;

export const get_institutes = ( ) => async(dispatch) =>{
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
                type: GET_INSTITUTES_SUCCESS,
                payload: res.data
            });
            return
            
        } else {
            
            dispatch({ type: GET_INSTITUTES_FAIL }); 
        }



    } catch (error) {
        dispatch({ type: GET_INSTITUTES_FAIL }); 
    }


}

export const get_institute = ( code ) => async (dispatch) => {
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
                type: GET_INSTITUTE_SUCCESS,
                payload: res.data
            });

            
        } else {
            dispatch({
                type: GET_INSTITUTE_FAIL
            });
        }

    } catch(err){
        dispatch({
            type: GET_INSTITUTE_FAIL
        });
    }

}