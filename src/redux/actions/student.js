import {

    GET_STUDENTS_SUCCESS,
    GET_STUDENTS_FAIL,
    GET_STUDENT_SUCCESS,
    GET_STUDENT_FAIL

} from './types';

import axios from 'axios';
import { API_URL } from '../../routers/Api';
const END_POINT = `${ API_URL }/api/students`;

export const get_students = ( ) => async(dispatch) =>{
    const config = {
        headers: {
            'Accept': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        }
    };

    try {
        
        const res = await axios.get( `${END_POINT}/`, config);
        if (res.status === 200) {

            dispatch({
                type: GET_STUDENTS_SUCCESS,
                payload: res.data
            });
            return
            
        } else {
            
            dispatch({ type: GET_STUDENTS_FAIL });
            return
        }



    } catch (error) {
        dispatch({ type: GET_STUDENTS_FAIL }); 
        return
    }


}

export const get_institute_students = ( institute ) => async(dispatch) =>{
    const config = {
        headers: {
            'Accept': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        }
    };

    try {
        
        const res = await axios.get( `${END_POINT}/institute/${institute}`, config);
        if (res.status === 200) {
            dispatch({
                type: GET_STUDENTS_SUCCESS,
                payload: res.data
            });
            return
            
        } else {
            
            dispatch({ type: GET_STUDENTS_FAIL });
            return
        }



    } catch (error) {
        dispatch({ type: GET_STUDENTS_FAIL }); 
        return
    }


}

export const get_student = ( code ) => async (dispatch) => {
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
                type: GET_STUDENT_SUCCESS,
                payload: res.data
            });

            
        } else {
            dispatch({
                type: GET_STUDENT_FAIL
            });
        }

    } catch(err){
        dispatch({
            type: GET_STUDENT_FAIL
        });
    }

}