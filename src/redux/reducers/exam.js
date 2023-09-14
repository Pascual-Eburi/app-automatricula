import {
    GET_EXAMS_SUCCESS,
    GET_EXAMS_FAIL,
    GET_EXAM_SUCCESS,
    GET_EXAM_FAIL
} from '../actions/types';


const initialState = {
    exams: null,
    exam: null
};

export default function Exam(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        case GET_EXAMS_SUCCESS:
            return {
                ...state,
                exams: payload.exams
            }
        case GET_EXAMS_FAIL:
            return {
                ...state, 
                exams: null
            }


        case GET_EXAM_SUCCESS:
            return {
                ...state,
                exam: payload.exam
            }
        case GET_EXAM_FAIL:
            return {
                ...state,
                exam: null
            }

        default:
            return state
    }
}