import {

    GET_EXAMS_SUCCESS,
    GET_EXAMS_FAIL,
    GET_EXAM_SUCCESS,
    GET_EXAM_FAIL

} from './types'

import axios from 'axios';
import { API_URL } from '../../routers/Api';
const END_POINT = `${ API_URL }/api/exam`

export const get_student_exams = ( student ) => async(dispatch) =>{
    const config = {
        headers: {
            'Accept': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        }
    };

    try {
        
        const res = await axios.get( `${END_POINT}/student/${student}`, config);
        if (res.status === 200) {

            dispatch({
                type: GET_EXAMS_SUCCESS,
                payload: res.data
            });
            return
            
        } else {
            
            dispatch({ type: GET_EXAMS_FAIL }); 
        }



    } catch (error) {
        dispatch({ type: GET_EXAMS_FAIL }); 
    }


}

export const get_institute_exams = ( institute) => async(dispatch) =>{
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
                type: GET_EXAMS_SUCCESS,
                payload: res.data
            });
            return
            
        } else {
            
            dispatch({ type: GET_EXAMS_FAIL }); 
        }



    } catch (error) {
        dispatch({ type: GET_EXAMS_FAIL }); 
    }


}


export const get_exams = ( ) => async(dispatch) =>{
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
                type: GET_EXAMS_SUCCESS,
                payload: res.data
            });
            return
            
        } else {
            
            dispatch({ type: GET_EXAMS_FAIL }); 
        }



    } catch (error) {
        dispatch({ type: GET_EXAMS_FAIL }); 
    }


}

export const get_exam = ( code ) => async (dispatch) => {
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
                type: GET_EXAM_SUCCESS,
                payload: res.data
            });

            
        } else {
            dispatch({
                type: GET_EXAM_FAIL
            });
        }

    } catch(err){
        dispatch({
            type: GET_EXAM_FAIL
        });
    }

}



