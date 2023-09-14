// Authentication

/* ------------------------------------------
    Acciones para autenticación de usuario
-----------------------------------------------*/
export const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS'; // Acción para registro de usuario exitoso
export const SIGNUP_FAIL = 'SIGNUP_FAIL'; // Acción para registro de usuario fallido
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'; // Acción para inicio de sesión exitoso
export const LOGIN_FAIL = 'LOGIN_FAIL'; // Acción para inicio de sesión fallido
export const USER_LOADED_SUCCESS = 'USER_LOADED_SUCCESS'; // Acción para carga de usuario exitosa
export const USER_LOADED_FAIL = 'USER_LOADED_FAIL'; // Acción para carga de usuario fallida
export const ACTIVATION_SUCCESS = 'ACTIVATION_SUCCESS'; // Acción para activación de cuenta exitosa
export const ACTIVATION_FAIL = 'ACTIVATION_FAIL'; // Acción para activación de cuenta fallida
export const SET_AUTH_LOADING = 'SET_AUTH_LOADING'; // Acción para establecer la carga de autenticación
export const REMOVE_AUTH_LOADING = 'REMOVE_AUTH_LOADING'; // Acción para eliminar la carga de autenticación
export const AUTHENTICATED_SUCCESS = 'AUTHENTICATED_SUCCESS'; // Acción para autenticación exitosa
export const AUTHENTICATED_FAIL = 'AUTHENTICATED_FAIL'; // Acción para autenticación fallida
export const REFRESH_SUCCESS = 'REFRESH_SUCCESS'; // Acción para actualización de token exitosa
export const REFRESH_FAIL = 'REFRESH_FAIL'; // Acción para actualización de token fallida
export const LOGOUT = 'LOGOUT'; // Acción para cierre de sesión

/*-----------------------------------------------
    Acciones para restablecimiento de contraseña
---------------------------------------------------*/
export const RESET_PASSWORD_SUCCESS = 'RESET_PASSWORD_SUCCESS'; // Acción para restablecimiento de contraseña exitoso
export const RESET_PASSWORD_FAIL = 'RESET_PASSWORD_FAIL'; // Acción para restablecimiento de contraseña fallido
export const RESET_PASSWORD_CONFIRM_SUCCESS = 'RESET_PASSWORD_CONFIRM_SUCCESS'; // Acción para confirmación de restablecimiento de contraseña exitosa
export const RESET_PASSWORD_CONFIRM_FAIL = 'RESET_PASSWORD_CONFIRM_FAIL'; // Acción para confirmación de restablecimiento de contraseña fallida


/*-----------------------------------
    Acciones para mostrar alertas
--------------------------------------------*/
export const SET_ALERT = 'SET_ALERT';
export const REMOVE_ALERT = 'REMOVE_ALERT';


/*------------------------------------------------
    Acciones para convocatorias
----------------------------------------------------*/
export const GET_OPEN_ANNOUNCEMENT_SUCCESS = 'GET_OPEN_ANNOUNCEMENT_SUCCESS';
export const GET_OPEN_ANNOUNCEMENT_FAIL = 'GET_OPEN_ANNOUNCEMENT_FAIL';

export const GET_ANNOUNCEMENTS_SUCCESS = 'GET_ANNOUNCEMENTS_SUCCESS';
export const GET_ANNOUNCEMENTS_FAIL = 'GET_ANNOUNCEMENTS_FAIL';

export const GET_ANNOUNCEMENT_SUCCESS = 'GET_ANNOUNCEMENT_SUCCESS';
export const GET_ANNOUNCEMENT_FAIL = 'GET_ANNOUNCEMENT_FAIL';

/*------------------------------------------------
    Acciones para matriculas
----------------------------------------------------*/

export const GET_ENROLLMENTS_SUCCESS = 'GET_ENROLLMENTS_SUCCESS';
export const GET_ENROLLMENTS_FAIL = 'GET_ENROLLMENTS_FAIL';

export const GET_ENROLLMENT_SUCCESS = 'GET_ENROLLMENT_SUCCESS';
export const GET_ENROLLMENT_FAIL = 'GET_ENROLLMENT_FAIL';

//export const IS_ENROLLED_IN_ANNOUNCEMENT_SUCCESS = 'IS_ENROLLED_IN_ANNOUNCEMENT_SUCCESS';
//export const NOT_ENROLLED_IN_ANNOUNCEMENT_SUCCESS = 'NOT_ENROLLED_IN_ANNOUNCEMENT_SUCCESS';

export const CHECK_ENROLLED_SUCCESS = 'CHECK_ENROLLED_SUCCESS';
export const CHECK_ENROLLED_FAIL = 'CHECK_ENROLLED_FAIL';

/*------------------------------------------------
    Acciones para examenes
----------------------------------------------------*/

export const GET_EXAMS_SUCCESS = 'GET_EXAMS_SUCCESS';
export const GET_EXAMS_FAIL = 'GET_EXAMS_FAIL';

export const GET_EXAM_SUCCESS = 'GET_EXAM_SUCCESS';
export const GET_EXAM_FAIL = 'GET_EXAM_FAIL';

/*------------------------------------------------
    Acciones para asignaturas
----------------------------------------------------*/

export const GET_SUBJECTS_SUCCESS = 'GET_SUBJECTS_SUCCESS';
export const GET_SUBJECTS_FAIL = 'GET_SUBJECTS_FAIL';

export const GET_GENERAL_PHASE_SUBJECTS_SUCCESS = 'GET_GENERAL_PHASE_SUBJECTS_SUCCESSS';
export const GET_GENERAL_PHASE_SUBJECTS_FAIL = 'GET_GENERAL_PHASE_SUBJECTS_FAIL';

export const GET_MODALITY_SUBJECTS_SUCCESS = 'GET_MODALITY_SUBJECTS_SUCCESSS';
export const GET_MODALITY_SUBJECTS_FAIL = 'GET_MODALITY_SUBJECTS_FAIL';

export const GET_SUBJECT_SUCCESS = 'GET_SUBJECT_SUCCESS';
export const GET_SUBJECT_FAIL = 'GET_SUBJECT_FAIL';

/*------------------------------------------------
    Acciones para carreras
----------------------------------------------------*/

export const GET_DEGREES_SUCCESS = 'GET_DEGREES_SUCCESS';
export const GET_DEGREES_FAIL = 'GET_DEGREES_FAIL';

export const GET_MODALITY_DEGREES_SUCCESS = 'GET_MODALITY_DEGREES_SUCCESS';
export const GET_MODALITY_DEGREES_FAIL = 'GET_MODALITY_DEGREES_FAIL';

export const GET_DEGREE_SUCCESS = 'GET_DEGREE_SUCCESS';
export const GET_DEGREE_FAIL = 'GET_DEGREE_FAIL';


/*------------------------------------------------
    Acciones para institutos
----------------------------------------------------*/

export const GET_INSTITUTES_SUCCESS = 'GET_INSTITUTES_SUCCESS';
export const GET_INSTITUTES_FAIL = 'GET_INSTITUTES_FAIL';

export const GET_INSTITUTE_SUCCESS = 'GET_INSTITUTE_SUCCESS';
export const GET_INSTITUTE_FAIL = 'GET_INSTITUTE_FAIL';


/*------------------------------------------------
    Acciones para alumnos
----------------------------------------------------*/

export const GET_STUDENTS_SUCCESS = 'GET_STUDENTS_SUCCESS';
export const GET_STUDENTS_FAIL = 'GET_STUDENTS_FAIL';

export const GET_STUDENT_SUCCESS = 'GET_STUDENT_SUCCESS';
export const GET_STUDENT_FAIL = 'GET_STUDENT_FAIL';


/*------------------------------------------------
    Acciones para modalidades de bachillerato
----------------------------------------------------*/

export const GET_MODALITIES_SUCCESS = 'GET_MODALITIES_SUCCESS';
export const GET_MODALITIES_FAIL = 'GET_MODALITIES_FAIL';

export const GET_MODALITY_SUCCESS = 'GET_MODALITY_SUCCESS';
export const GET_MODALITY_FAIL = 'GET_MODALITY_FAIL';


/*------------------------------------------------
    Acciones para provincias
----------------------------------------------------*/

export const GET_PROVINCES_SUCCESS = 'GET_PROVINCES_SUCCESS';
export const GET_PROVINCES_FAIL = 'GET_PROVINCES_FAIL';

export const GET_PROVINCE_SUCCESS = 'GET_PROVINCE_SUCCESS';
export const GET_PROVINCE_FAIL = 'GET_PROVINCE_FAIL';


/*------------------------------------------------
    Acciones para distritos
----------------------------------------------------*/

export const GET_DISTRICTS_SUCCESS = 'GET_DISTRICTS_SUCCESS';
export const GET_DISTRICTS_FAIL = 'GET_DISTRICTS_FAIL';

export const GET_DISTRICT_SUCCESS = 'GET_DISTRICT_SUCCESS';
export const GET_DISTRICT_FAIL = 'GET_DISTRICT_FAIL';