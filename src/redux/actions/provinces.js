import {

   GET_PROVINCES_SUCCESS,
   GET_PROVINCES_FAIL ,
   GET_PROVINCE_SUCCESS ,
   GET_PROVINCE_FAIL
    

} from './types';

import axios from 'axios';
import { API_URL } from '../../routers/Api';
const END_POINT = `${ API_URL }/api/geodata/provinces`;

export const get_provinces = ( ) => async(dispatch) =>{
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
                type: GET_PROVINCES_SUCCESS,
                payload: res.data
            });
            return
            
        } else {
            
            dispatch({ type: GET_PROVINCES_FAIL }); 
        }



    } catch (error) {
        dispatch({ type: GET_PROVINCES_FAIL }); 
    }


}

export const get_province = ( code ) => async (dispatch) => {
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
                type: GET_PROVINCE_SUCCESS,
                payload: res.data
            });

            
        } else {
            dispatch({
                type: GET_PROVINCE_FAIL
            });
        }

    } catch(err){
        dispatch({
            type: GET_PROVINCE_FAIL
        });
    }

}