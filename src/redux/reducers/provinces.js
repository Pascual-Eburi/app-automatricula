import {
    GET_PROVINCES_SUCCESS,
    GET_PROVINCES_FAIL ,
    GET_PROVINCE_SUCCESS ,
    GET_PROVINCE_FAIL

} from '../actions/types';


const initialState = {
    provinces: null,
    province: null
};

export default function Province(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        case GET_PROVINCES_SUCCESS:
            return {
                ...state,
                provinces: payload.provinces
            }
        case GET_PROVINCES_FAIL:
            return {
                ...state, 
                provinces: null
            }


        case GET_PROVINCE_SUCCESS:
            return {
                ...state,
                province: payload.province
            }
        case GET_PROVINCE_FAIL:
            return {
                ...state,
                province: null
            }

        default:
            return state
    }
}