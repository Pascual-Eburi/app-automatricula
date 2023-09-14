import {
    GET_MODALITIES_SUCCESS,
    GET_MODALITIES_FAIL,
    GET_MODALITY_SUCCESS,
    GET_MODALITY_FAIL
} from '../actions/types';


const initialState = {
    modalities: null,
    modality: null
};

export default function Modality(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        case GET_MODALITIES_SUCCESS:
            return {
                ...state,
                modalities: payload.modalities
            }
        case GET_MODALITIES_FAIL:
            return {
                ...state, 
                modalities: null
            }


        case GET_MODALITY_SUCCESS:
            return {
                ...state,
                modality: payload.modality
            }
        case GET_MODALITY_FAIL:
            return {
                ...state,
                modality: null
            }

        default:
            return state
    }
}