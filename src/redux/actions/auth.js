import {
    SIGNUP_SUCCESS,
    SIGNUP_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    ACTIVATION_SUCCESS,
    ACTIVATION_FAIL,
    SET_AUTH_LOADING,
    REMOVE_AUTH_LOADING,
    USER_LOADED_SUCCESS,
    USER_LOADED_FAIL,
    AUTHENTICATED_SUCCESS,
    AUTHENTICATED_FAIL,
    REFRESH_SUCCESS,
    REFRESH_FAIL,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAIL,
    RESET_PASSWORD_CONFIRM_SUCCESS,
    RESET_PASSWORD_CONFIRM_FAIL,
    LOGOUT,
  } from "./types";

import { setAlert } from './alert';
import axios from 'axios';
import { API_URL } from "../../routers/Api";


export const load_instute_staff = async ( id )  => {
    const config = {
        headers: {
            'Authorization': `JWT ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    try {
        // Se realiza una solicitud GET al endpoint de usuario utilizando axios process.env.API_URL 
        
        const res = await axios.get(`${API_URL}/api/institute/staff/${ id }`, config);
        
        // Si la solicitud es exitosa (código de estado 200), se carga el usuario en el estado global
        if (res.status === 200) { return res.data}
    }
    catch(err){

        return err.response.data
        // Si se produce un error al realizar la solicitud, se falla la carga del usuario

    }
}

export const load_student = async ( id )  => {
    const config = {
        headers: {
            'Authorization': `JWT ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    try {
        // Se realiza una solicitud GET al endpoint de usuario utilizando axios process.env.API_URL
        
        const res = await axios.get(`${API_URL}/api/students/${ id }`, config);
        
        // Si la solicitud es exitosa (código de estado 200), se carga el usuario en el estado global
        if (res.status === 200) {
            return res.data

        }
    }
    catch(err){

        return err.response.data
        // Si se produce un error al realizar la solicitud, se falla la carga del usuario

    }
}

/**
 * Verifica si hay un token de acceso almacenado en el almacenamiento local (localStorage) del navegador.
 * Si el token existe, realiza una solicitud de verificación de token al servidor utilizando la API de autenticación.
 * Si la respuesta del servidor indica que el token es válido, la función dispara una acción de éxito de autenticación.
 * Si la respuesta del servidor indica que el token no es válido, la función dispara una acción de falla de autenticación.
 * Si el token no existe en el almacenamiento local, la función dispara una acción de falla de autenticación.
 * @returns {Function} - Una función asíncrona que acepta un parámetro de despacho de acciones (dispatch).
 */
export const check_authenticated = () => async dispatch => {
    // Verifica si hay un token de acceso almacenado en localStorage
    if(localStorage.getItem('access')){
        const config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };

        // Crea un cuerpo de solicitud que incluye el token de acceso
        const body = JSON.stringify({
            token: localStorage.getItem('access')
        });

        try {
            // Realiza una solicitud POST al servidor para verificar el token de acceso
            const res = await axios.post(`${API_URL}/auth/jwt/verify/`, body, config);

            if (res.status === 200) {
                // Si la respuesta del servidor indica que el token es válido, dispara una acción de éxito de autenticación
                dispatch({
                    type: AUTHENTICATED_SUCCESS
                });
            } else {
                // Si la respuesta del servidor indica que el token no es válido, dispara una acción de falla de autenticación
                dispatch({
                    type: AUTHENTICATED_FAIL
                });
            }
        } catch(err){
            // Si hay un error en la solicitud, dispara una acción de falla de autenticación
            dispatch({
                type: AUTHENTICATED_FAIL
            });
        }
    } else {
        // Si no hay un token de acceso almacenado en localStorage, dispara una acción de falla de autenticación
        dispatch({
            type: AUTHENTICATED_FAIL
        });
    }
}

/** 
 * La función "refresh" actualiza el token de acceso utilizando el token de refresco almacenado en el almacenamiento local del navegador.
 * Si se actualiza el token de acceso exitosamente, se guarda en el estado global.
 * 
 * @returns {Object} - El objeto que contiene el tipo de acción y los datos del token de acceso actualizado
 * 
 */
export const refresh = () => async dispatch => {
    // Si se encuentra un token de refresco en el almacenamiento local del navegador, se agrega a la solicitud como cuerpo.
    if (localStorage.getItem('refresh')) {
        const config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };

        const body = JSON.stringify({
            refresh: localStorage.getItem('refresh')
        });

        try {
            // Se realiza una solicitud POST al endpoint de actualización utilizando axios y process.env.API_URL
            const res = await axios.post(`${API_URL}/auth/jwt/refresh/`, body, config);
            
            // Si la solicitud es exitosa (código de estado 200), se actualiza el token de acceso en el estado global
            if (res.status === 200) {
                dispatch({
                    type: REFRESH_SUCCESS,
                    payload: res.data
                });
            } else {
                // Si no se obtiene un código de estado 200, se falla la actualización del token de acceso
                dispatch({
                    type: REFRESH_FAIL
                });
            }
        }catch(err){
            // Si se produce un error al realizar la solicitud, se falla la actualización del token de acceso
            dispatch({
                type: REFRESH_FAIL
            });
        }
    } else {
        // Si no se encuentra un token de refresco en el almacenamiento local del navegador, se falla la actualización del token de acceso
        dispatch({
            type: REFRESH_FAIL
        });
    }
}


/**
 * Carga los datos del usuario en el estado global si hay un token de acceso en el almacenamiento local del navegador.
 * 
 * @returns {Function} Función que puede ser utilizada como un thunk y es ejecutada por el store de Redux.
 */
export const load_user = () => async dispatch => {
    // Si se encuentra un token de acceso en el almacenamiento local del navegador, 
    // se agrega a la solicitud como encabezado de autorización
    if(!localStorage.getItem('access')){
        // Si no se encuentra un token de acceso en el almacenamiento local del navegador, se falla la carga del usuario
        dispatch({
            type: USER_LOADED_FAIL
        });
    }
    const config = {
        headers: {
            'Authorization': `JWT ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    try {
        // Se realiza una solicitud GET al endpoint de usuario utilizando axios process.env.API_URL
        const res = await axios.get(`${API_URL}/auth/users/me/`, config);
        
        // Si la solicitud es exitosa (código de estado 200), se carga el usuario en el estado global
        if (res.status === 200) {

            let payload = {user_data: res.data};

            // student role
            if (res.data.rol === 'student'){

                const student_data = await load_student(res.data.id);
                if (student_data.student){
                    payload.student_data = student_data.student

                    dispatch({
                        type: USER_LOADED_SUCCESS,
                        payload: payload //res.data
                    });

                    return
                }
                                
                dispatch({
                    type: USER_LOADED_FAIL
                });
                

                return
            }

            if(res.data.rol === 'institute_staff'){
                
                const staff_data = await load_instute_staff(res.data.id);
                if (staff_data.staff_data){
                    payload.staff_data = staff_data.staff_data

                    dispatch({
                        type: USER_LOADED_SUCCESS,
                        payload: payload //res.data
                    });
                }else{
                                
                    dispatch({
                        type: USER_LOADED_FAIL
                    });
                } 
                
                return; 
            }

            // is admin o secretaria general
            if (res.data.rol === 'admin_staff' || res.data.rol === 'staff'){
                dispatch({
                    type: USER_LOADED_SUCCESS,
                    payload: payload //res.data
                });
                return
            }




        } else {
            // Si no se obtiene un código de estado 200, se falla la carga del usuario
            dispatch({
                type: USER_LOADED_FAIL
            });
        }
    }
    catch(err){
        // Si se produce un error al realizar la solicitud, se falla la carga del usuario
        dispatch({
            type: USER_LOADED_FAIL
        });
    }
    
}


/**
 * Inicia sesión de un usuario
 * @param {string} email - correo electrónico del usuario
 * @param {string} password - contraseña del usuario
 * @returns {object} - objeto con información de la acción realizada
 */
export const login = (email, password) => async dispatch => {
    dispatch({type: SET_AUTH_LOADING});
    if (!email || !password){
        dispatch({ type: LOGIN_FAIL });
        dispatch({ type: REMOVE_AUTH_LOADING });
        
        dispatch(
            setAlert('Datos incompletos', 'Todos los campos del formulario son obligatorios', 'error')
            
            );
        return false; 
    }

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ email,password });

    try {
        const res = await axios.post(`${API_URL}/auth/jwt/create/`, body, config);
    
        if (res.status === 200) {
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data
            });
            dispatch(load_user());
            
            dispatch({
                type: REMOVE_AUTH_LOADING
            });

            dispatch(
                setAlert('Datos correctos', 'Inicio de sesión con éxito', 'success')
                );
            return true;

        } 
            
        dispatch({
                type: LOGIN_FAIL
        });
            
        dispatch({
                type: REMOVE_AUTH_LOADING
        });
            
            dispatch(
                setAlert('Datos incorrectos', 'Error al iniciar sesion.', 'error')
                
                );
            return false;
        
    }
    catch(err){

        dispatch({
            type: LOGIN_FAIL
        });
        dispatch({
            type: REMOVE_AUTH_LOADING
        });
        dispatch(
            setAlert('Error en la solicitud','Error al iniciar sesion. Intenta mas tarde', 'warning')
            
            );
        return false;
    }
}

export const add_user = async (name, last_name, email, password, re_password, phone, rol = '') => {
    //dispatch({ type: SET_AUTH_LOADING });

    const config = {
        headers: { 'Content-Type': 'application/json' }
    };

    const body = JSON.stringify({ name, last_name, email, password, re_password, phone, rol });

    //try {
    return await axios.post(`${API_URL}/auth/users/`, body, config);
        
}

export const add_student = (formData) => async dispatch => {

    const {name, last_name, email, password, re_password, phone, ...res} = formData;

    let user;
    // crear la cuenta de usuario
    try {
        const user_created = await add_user(name, last_name, email, password, re_password, phone );

        if (user_created.status !== 201) { 
            //dispatch({ type: SIGNUP_FAIL });
            dispatch(setAlert('Cuenta no creada', 'No se ha podido crear la cuenta de usuario para el alumno', 'error'));//setAlert('Error al crear cuenta', 'red'));
            dispatch({
                type: REMOVE_AUTH_LOADING
            });

            return false;
        }

        user = user_created.data;
        
    } catch (error) {
        //dispatch({ type: SIGNUP_FAIL });
        let title = 'Error en la solicitud';
        let msg = 'Ha ocurrido un error al realizar la solicitud'
        if(error.response.status == 400 ){
            title = 'Formulario invalido'
            msg = 'El formulario contine errores, revisalos.'
        }


        dispatch(
            setAlert(title , msg, 'error'));//setAlert('Error al crear cuenta', 'red'));
        dispatch({
            type: REMOVE_AUTH_LOADING
        });
        return false;  
    }

    // todo ha ido bien, cuenta de usuario creada

    // Agregar los elementos 
    const studentFormData = new FormData();
    Object.entries(res).forEach(([key, value]) => {
        // Agregar el elemento al formData normalmente
        if (key === 'photo'){
            const file = res['photo'];
            studentFormData.append('photo', file, file.name)

        }else if (key === 'student_school_report'){
            const file = res['student_school_report'];
            studentFormData.append('student_school_report', file)
        }
        else{

            studentFormData.append(key, value);
        }
        
    });

    /**
     *  Si todo okay al crar cuenta de usuario
     * {
        "name": "Pascualeliminar",
        "last_name": "EBURI BILOKO",
        "phone": "12342346",
        "email": "antonios@gmail.com",
        "id": 48
        }
     */
    studentFormData.append('user', user.id);
    console.log(studentFormData);


    const config = {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          Authorization: `JWT ${localStorage.getItem("access")}`,
        },
      };



    try {
        const res = await axios.post(
            `${API_URL}/api/students/add/`,
            studentFormData,
            config
          );
        
        if (res.status !== 201){
            dispatch(setAlert('Error en la preinscripcion', 'No se ha podido realizar la preinscripcion del alumno', 'error'))
            dispatch({
                type: REMOVE_AUTH_LOADING
            });
            return false;
        }


        dispatch(
            setAlert('Alumno preinscrito con exito', 'Se ha enviado un correo de activación al correo del alumno.','success'));
            dispatch({
                type: REMOVE_AUTH_LOADING
            });

        return true;



    } catch (err) {
        dispatch({
            type: REMOVE_AUTH_LOADING
        });
        console.log(err)
        dispatch(setAlert('Error en la solicitud', 'Error conectando con el servidor, intenta mas tarde.', 'error'));
        return false;
    }
};

export const add_institute_staff = (formData) => async dispatch => {
    // dataos para la cuenta de usuario
    const {name, last_name, email, password, re_password, phone,rol, ...res} = formData;
    let user;
    // crear la cuenta de usuario
    try {
        const user_created = await add_user(name, last_name, email, password, re_password, phone, rol );

        if (user_created.status !== 201) { 
            //dispatch({ type: SIGNUP_FAIL });
            dispatch(setAlert('Cuenta no creada', 'No se ha podido crear la cuenta de usuario para el alumno', 'error'));//setAlert('Error al crear cuenta', 'red'));
            dispatch({
                type: REMOVE_AUTH_LOADING
            });

            return false;
        }

        // se ha creado la cuenta del usuario
        user = user_created.data;
        
    } catch (error) {

        let title = 'Error en la solicitud';
        let msg = 'Ha ocurrido un error al realizar la solicitud'
        if(error.response.status == 400 ){
            title = 'Formulario invalido'
            msg = 'El formulario contine errores, revisalos.'
        }


        dispatch( setAlert(title , msg, 'error'));//setAlert('Error al crear cuenta', 'red'));
        return false;  
    }

    // todo ha ido bien, cuenta de usuario creada

    // Agregar los elementos 
    const StaffDataFormData = new FormData();
    Object.entries(res).forEach(([key, value]) => {
        // Agregar el elemento al formData normalmente
        if (key === 'photo'){
            const file = res['photo'];
            StaffDataFormData.append('photo', file, file.name)

        } else{
            StaffDataFormData.append(key, value);
        }
        
    });

    // id de usuairo
    StaffDataFormData.append('user', user.id);
    
    console.log(StaffDataFormData);


    const config = {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          Authorization: `JWT ${localStorage.getItem("access")}`,
        },
      };



    try {
        const res = await axios.post(
            `${API_URL}/api/institute/staff/add/`,
            StaffDataFormData,
            config
          );
        
        if (res.status !== 201){
            dispatch(setAlert('Error durante el registro', 'No se ha podido realizar el registro en el sistema', 'error'))
            return false;
        }


        dispatch(
            setAlert('Personal inscrito correctamente', 'Se ha enviado un correo de activación al correo del usuario.','success'));

        return true;



    } catch (err) {

        console.log(err)
        dispatch(setAlert('Error en la solicitud', 'Error conectando con el servidor, intenta mas tarde.', 'error'));
        return false;
    }
};



export const add_staff = (formData) => async dispatch => {
    // dataos para la cuenta de usuario
    const {name, last_name, email, password, re_password, phone, ...res} = formData;
    let user;
    // crear la cuenta de usuario
    try {
        const user_created = await add_user(name, last_name, email, password, re_password, phone );

        if (user_created.status !== 201) { 
            //dispatch({ type: SIGNUP_FAIL });
            dispatch(setAlert('Cuenta no creada', 'No se ha podido crear la cuenta de usuario para el alumno', 'error'));//setAlert('Error al crear cuenta', 'red'));
            dispatch({
                type: REMOVE_AUTH_LOADING
            });

            return false;
        }

        // se ha creado la cuenta del usuario
        user = user_created.data;
        
    } catch (error) {

        let title = 'Error en la solicitud';
        let msg = 'Ha ocurrido un error al realizar la solicitud'
        if(error.response.status === 400 ){
            title = 'Formulario invalido'
            msg = 'El formulario contine errores, revisalos.'
        }


        dispatch( setAlert(title , msg, 'error'));//setAlert('Error al crear cuenta', 'red'));
        return false;  
    }

    // todo ha ido bien, cuenta de usuario creada

    // Agregar los elementos 
    const StaffFormData = new FormData();
    Object.entries(res).forEach(([key, value]) => {
        // Agregar el elemento al formData normalmente
        if (key === 'photo'){
            const file = res['photo'];
            StaffFormData.append('photo', file, file.name)

        } else{
            StaffFormData.append(key, value);
        }
        
    });

    // id de usuairo
    StaffFormData.append('user', user.id);
    
    console.log(StaffFormData);


    const config = {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          Authorization: `JWT ${localStorage.getItem("access")}`,
        },
      };



    try {
        const res = await axios.post(
            `${API_URL}/api/users/staff/add/`,
            StaffFormData,
            config
          );
        
        if (res.status !== 201){
            dispatch(setAlert('Error durante el registro', 'No se ha podido realizar el registro en el sistema', 'error'))
            return false;
        }


        dispatch(
            setAlert('Personal inscrito correctamente', 'Se ha enviado un correo de activación al correo del usuario.','success'));

        return true;



    } catch (err) {

        console.log(err)
        dispatch(setAlert('Error en la solicitud', 'Error conectando con el servidor, intenta mas tarde.', 'error'));
        return false;
    }
};



export const activate = (uid, token) => async dispatch => {
    dispatch({
        type: SET_AUTH_LOADING
    });

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({
        uid,
        token
    });

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/activation/`, body, config);
    
        if (res.status === 204) {
            dispatch({
                type: ACTIVATION_SUCCESS
            });
            dispatch(setAlert('Cuenta activada correctamente','Se ha activado tu cuenta correctamente', 'success'));
            dispatch({
                type: REMOVE_AUTH_LOADING
            });
            return true;
        } 

        dispatch({
            type: ACTIVATION_FAIL
        });

        dispatch(setAlert('Error activando cuenta', 'No se ha podido activar tu cuenta', 'error'));
        
        dispatch({
            type: REMOVE_AUTH_LOADING
        });
        return false;
    }
    catch(err){
        dispatch({
            type: ACTIVATION_FAIL
        });
        dispatch({
            type: REMOVE_AUTH_LOADING
        });
        dispatch(setAlert('Error al conectar con el servidor', 'No se ha podido activar tu cuenta.', 'error'));

        return false;
    }
};


export const reset_password = (email) => async dispatch => {


    dispatch({ type: SET_AUTH_LOADING  });


    if (!email || email.length === 0 || email === ''){
        dispatch({ type: REMOVE_AUTH_LOADING });

        dispatch(setAlert('Email invalido', 'Es necesario un email para poder enviarte el link de recuperacion', 'error')); 

        return false;
    }


    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ email });

    try{
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/reset_password/`, body, config);
        
        if (res.status === 204) {
            dispatch({ type: RESET_PASSWORD_SUCCESS });
            dispatch({ type: REMOVE_AUTH_LOADING });

            dispatch(setAlert('Email enviado','Se ha enviado una confirmación al correo', 'success'));

            return true;
        } 

        dispatch({ type: RESET_PASSWORD_FAIL });
        dispatch({ type: REMOVE_AUTH_LOADING });

        dispatch(setAlert('Error durante el proceso', 'No se ha podido enviar el email', 'error'));

        return false;
        
    }
    catch(err){

        dispatch({ type: RESET_PASSWORD_FAIL });
        dispatch({ type: REMOVE_AUTH_LOADING });

        dispatch(setAlert('Error durante el proceso', 'No se ha podido enviar el email', 'error'));

        return false;
    }
}



export const reset_password_confirm = (uid, token, new_password, re_new_password) => async dispatch => {
    dispatch({
        type: SET_AUTH_LOADING
    });

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({
        uid,
        token,
        new_password,
        re_new_password
    });

    if (new_password !== re_new_password) {
        dispatch({ type: RESET_PASSWORD_CONFIRM_FAIL });
        dispatch({ type: REMOVE_AUTH_LOADING });
        dispatch(setAlert('Revisa las contarseñas', 'Las contaraseñas no coinciden', 'error'));
        return false;
    }

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/reset_password_confirm/`, body, config);
    
        if (res.status === 204) {
            dispatch({
                type: RESET_PASSWORD_CONFIRM_SUCCESS
            });
            dispatch({
                type: REMOVE_AUTH_LOADING
            });

            dispatch(setAlert('Contraseña cambiada','Tu contraseña se ha cambiado correctamente', 'success'));

            return true;
        } 


        dispatch({
            type: RESET_PASSWORD_CONFIRM_FAIL
        });
        dispatch({
            type: REMOVE_AUTH_LOADING
        });
        dispatch(setAlert('Contraseña no cambiada','No se ha podido resetear tu contraseña', 'error'));

        return false;
        
    } catch(err){

        console.log(err)

        dispatch({
            type: RESET_PASSWORD_CONFIRM_FAIL
        });
        dispatch({
            type: REMOVE_AUTH_LOADING
        });

        // servidor down
        if(err.code && err.code === "ERR_NETWORK"){
            dispatch(setAlert('Error de red','No se ha podido establecer conexión con el servidor', 'error'));
            return false;
        }

        // contrase no es valida
        
        if(! (err.response) || !(err.response.data )){
            dispatch(setAlert('Error durante el proceso','No se ha podido resetear tu contraseña', 'error'));
            return false;
        }

        const data = err.response.data;


        if (data.hasOwnProperty('uid') || data.hasOwnProperty('token')){
            dispatch(setAlert('Error de datos','Los datos que has proporcionado no son validos', 'error'));

            return false;
        }


        dispatch(setAlert('Contraseña no válida','Tu contraseña es muy comúm o poco segura.', 'error'));  

        return false;
    }
}

export const logout = () => dispatch => {
    dispatch({
        type: LOGOUT
    });
    dispatch(setAlert('Cierre de sesión exitoso', 'Se ha cerrado de tu sesión ', 'success'))
}