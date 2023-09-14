import {
    GET_STUDENTS_SUCCESS,
    GET_STUDENTS_FAIL,
    GET_STUDENT_SUCCESS,
    GET_STUDENT_FAIL
} from '../actions/types';


const initialState = {
    students: null,
    student: null
};

export default function Student(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        case GET_STUDENTS_SUCCESS:
            return {
                ...state,
                students: payload.students
            }
        case GET_STUDENTS_FAIL:
            return {
                ...state, 
                students: null
            }


        case GET_STUDENT_SUCCESS:
            return {
                ...state,
                student: payload.student
            }
        case GET_STUDENT_FAIL:
            return {
                ...state,
                student: null
            }

        default:
            return state
    }
}