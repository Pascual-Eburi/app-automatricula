import {

    GET_ENROLLMENTS_SUCCESS,
    GET_ENROLLMENTS_FAIL,

    GET_ENROLLMENT_SUCCESS,
    GET_ENROLLMENT_FAIL,

    CHECK_ENROLLED_SUCCESS,
    CHECK_ENROLLED_FAIL ,

} from './types'

import axios from 'axios';
import { setAlert } from './alert';


const API_URL = process.env.REACT_APP_API_URL
const END_POINT = `${ API_URL }/api/enrollment`


export const get_enrollments = () => async (dispatch, getState) => {
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
            request_end_point = `${END_POINT}/enrollments`
        }


        const res = await axios.get( request_end_point, config);
    
        if (res.status === 200) {
            //console.log(res.data)
            dispatch({
                type: GET_ENROLLMENTS_SUCCESS,
                payload: res.data
            });

            
        } else {
            dispatch({
                type: GET_ENROLLMENTS_FAIL
            });
        }

    } catch(err){
        dispatch({
            type: GET_ENROLLMENTS_FAIL
        });
    }

}

export const get_student_enrollments = (student) => async (dispatch) => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        }
    };

    try {

        const res = await axios.get( `${END_POINT}/student/${student}`, config);
    
        if (res.status === 200) {
            //console.log(res.data)
            dispatch({
                type: GET_ENROLLMENTS_SUCCESS,
                payload: res.data
            });

            
        } else {
            dispatch({
                type: GET_ENROLLMENTS_FAIL
            });
        }

    } catch(err){
        dispatch({
            type: GET_ENROLLMENTS_FAIL
        });
    }

}

export const get_enrollment = ( code ) => async (dispatch) => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        }
    };

    try {

        const res = await axios.get( `${END_POINT}/${code}`, config);
    
        if (res.status === 200) {
            
            dispatch({
                type: GET_ENROLLMENT_SUCCESS,
                payload: res.data
            });

            
        } else {
            dispatch({
                type: GET_ENROLLMENT_FAIL
            });
        }

    } catch(err){
        dispatch({
            type: GET_ENROLLMENT_FAIL
        });
    }

}

export const get_enrollment_documents = ( code ) => async (dispatch) => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        }
    };

    try {

        const res = await axios.get( `${END_POINT}/documents/${code}`, config);
        if (res.status === 200){ 
            dispatch(setAlert('Documentos encontrados', 'se ha encontrado documentos', 'success'))
            return res.data; }

        dispatch(setAlert('Documentos no encontrados', 'No se ha encontrado documentos', 'warning'))
        return {};


    } catch(err){
        console.log(err)
        dispatch(setAlert('Ha ocurrido un error ', 'No ha podido obtener los documentos', 'error'))
        return {};
    }

}

export const check_is_enrolled_in_annoucement = ( student, announcement ) => async (dispatch) => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        },
        params: {
            student: student,
            announcement: announcement
        }
    };

    try {

        const res = await axios.get( `${END_POINT}/check/`, config);
    
        if (res.status === 200) {
            console.log(res)
            dispatch({
                type: CHECK_ENROLLED_SUCCESS,
                payload: res.data
            });

            
        } else {
            dispatch({
                type: CHECK_ENROLLED_FAIL,
            });
        }

    } catch(err){
        dispatch({
            type: CHECK_ENROLLED_FAIL
        });
    }

}

export const get_announcement_enrollments = ( announcement ) => async () => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        },
        params: {
            announcement: announcement
        }
    };

    try {

        const res = await axios.get( `${END_POINT}/enrollments`, config);
    
        if (res.status === 200) {
            return res.data.enrollments
  
        } 

        return false;

    } catch(err){
        console.log(err)
        return false;
    }

}

export const get_enrollment_exams = ( code ) => async () => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        },
    };

    try {

        const res = await axios.get( `${END_POINT}/exams/${code}`, config);
    
        if (res.status === 200) {
            return res.data.exams
  
        } 

        return false;

    } catch(err){
        console.log(err)
        return false;
    }

}

export const add_enrollment = (data) => async dispatch => {
    const enrollmentFormData = new FormData();
    Object.entries(data).forEach( ([key, value]) => {
        if (key === 'subjects' || key === 'degrees'){
            const valueString = value.join(','); // Convertir la lista en una cadena separada por comas
            enrollmentFormData.append(key, valueString);
        }else if(key === 'copy_id_card' || key === 'proof_of_payment'){
            const file = data[key];
            enrollmentFormData.append(key, file)
        }
        else{
            
            const val = data[key];
            enrollmentFormData.append(key, val);
        }
        
        /* } */
    });
    


    const config = {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          Authorization: `JWT ${localStorage.getItem("access")}`,
        },
      };

      try {
        const res = await axios.post( `${END_POINT}/create/` ,
            enrollmentFormData,
            config
          );
        
        if (res.status !== 201){
            dispatch(setAlert('Ha ocurrido un error ', 'No ha podido realizar la matrícula del alumno', 'error'))
            return false;
        }


        dispatch(
            setAlert('Matrícula presentada', 'La matrícula se ha formalizado correctamente.','success'));

        return true;



    } catch (err) {

        const response = err.response ? err.response.data : null;
        const message = response ? response.message : 'Error conectando con el servidor, intentalo más tarde';
        const type = response ? response.type : 'error';

        dispatch(setAlert('Error en la solicitud', message, type));
        return false;
    }

    
}


export const add_enrollment_grades = (data) => async dispatch => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        },
    };

    try {

        const res = await axios.post( `${END_POINT}/grades/add/`, data, config);
    
        if (res.status === 201) {
            dispatch(setAlert('Notas registradas', 'Las notas se han registrado correctamente', 'success'));
            return true
  
        } 
        dispatch(setAlert('Error durante el proceso', 'No se ha podido grabar las calificaciones', 'error'));
        return false;

    } catch(err){
        console.log(err)
        dispatch(setAlert('Error durante el proceso', 'No se ha podido grabar las calificaciones', 'error'));
        return false;
    }
}
