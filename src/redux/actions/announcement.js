import {
    GET_OPEN_ANNOUNCEMENT_SUCCESS,
    GET_OPEN_ANNOUNCEMENT_FAIL,

    GET_ANNOUNCEMENTS_SUCCESS,
    GET_ANNOUNCEMENTS_FAIL,

    GET_ANNOUNCEMENT_SUCCESS,
    GET_ANNOUNCEMENT_FAIL

} from './types'

import axios from 'axios';


const API_URL = process.env.REACT_APP_API_URL
const END_POINT = `${ API_URL }/api/announcement`


export const get_annoucements = () => async (dispatch, getState) => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        }
    };

    try {
        const user = await getState().Auth.user;
        if (!user){ return}

        const {user_data, ...rest} = user

        let request_end_point = ''

        // obtener las convocatorias en las que ha participado el alumno
        if (user_data.rol == 'student'){
            request_end_point = `${END_POINT}/student/${user_data.id}`

        }
         // obtner las convocatorias en las que han participado los alumnos del centro 
        else if(user_data.rol == 'institute_staff'){
            const {staff_data, ...rest} = user
            request_end_point = `${END_POINT}/institute/${staff_data.institute.code}`;

        }else{
            request_end_point = `${END_POINT}/announcements`
        }


        const res = await axios.get( request_end_point, config);
    
        if (res.status === 200) {
            //console.log(res.data)
            dispatch({
                type: GET_ANNOUNCEMENTS_SUCCESS,
                payload: res.data
            });

            
        } else {
            dispatch({
                type: GET_ANNOUNCEMENTS_FAIL
            });
        }

    } catch(err){
        dispatch({
            type: GET_ANNOUNCEMENTS_FAIL
        });
    }

}

export const get_open_announcement = () => async (dispatch, getState) => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        }
    };

    try { 
        const user = await getState().Auth.user;
        if (!user){ return}
        
        const res = await axios.get(`${END_POINT}/open`, config);
    
        if (res.status === 200) {
            
            dispatch({
                type: GET_OPEN_ANNOUNCEMENT_SUCCESS,
                payload: res.data
            });
        } else {
            dispatch({
                type: GET_OPEN_ANNOUNCEMENT_FAIL
            });
        }


    } catch(err){
        dispatch({
            type: GET_OPEN_ANNOUNCEMENT_FAIL
        });
    }
}