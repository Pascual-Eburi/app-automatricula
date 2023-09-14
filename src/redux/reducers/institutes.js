import {
    GET_INSTITUTES_SUCCESS,
    GET_INSTITUTES_FAIL,
    GET_INSTITUTE_SUCCESS,
    GET_INSTITUTE_FAIL
} from '../actions/types';


const initialState = {
    institutes: null,
    institute: null
};

export default function Institute(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        case GET_INSTITUTES_SUCCESS:
            return {
                ...state,
                institutes: payload.institutes
            }
        case GET_INSTITUTES_FAIL:
            return {
                ...state, 
                institutes: null
            }


        case GET_INSTITUTE_SUCCESS:
            return {
                ...state,
                institute: payload.institute
            }
        case GET_INSTITUTE_FAIL:
            return {
                ...state,
                institute: null
            }

        default:
            return state
    }
}