import {
    GET_ENROLLMENT_SUCCESS,
    GET_ENROLLMENT_FAIL,
    GET_ENROLLMENTS_SUCCESS,
    GET_ENROLLMENTS_FAIL,
    
    CHECK_ENROLLED_SUCCESS,
    CHECK_ENROLLED_FAIL ,

} from '../actions/types';


const initialState = {
    enrollments: null,
    enrollment: null,
    enrolled_in_announcement: null,
    enrolled_code: null

};

export default function Enrollment(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        case GET_ENROLLMENTS_SUCCESS:
            return {
                ...state,
                enrollments: payload.enrollments
            }
        case GET_ENROLLMENTS_FAIL:
            return {
                ...state, 
                enrollments: null
            }


        case GET_ENROLLMENT_SUCCESS:
            return {
                ...state,
                enrollment: payload.enrollment
            }

        case GET_ENROLLMENT_FAIL:
            return {
                ...state,
                enrollment: null
            }

        case CHECK_ENROLLED_SUCCESS:
            return {
                ...state,
                enrolled_in_announcement: payload.exists,
                enrolled_code: payload.code
            }
        
        case CHECK_ENROLLED_FAIL:
            return {
                ...state,
                enrolled_in_announcement: 'server error'
            }

        default:
            return state
    }
}