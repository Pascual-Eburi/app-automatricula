import {
    GET_OPEN_ANNOUNCEMENT_SUCCESS,
    GET_OPEN_ANNOUNCEMENT_FAIL,
    GET_ANNOUNCEMENT_SUCCESS,
    GET_ANNOUNCEMENT_FAIL,
    GET_ANNOUNCEMENTS_SUCCESS,
    GET_ANNOUNCEMENTS_FAIL 
} from '../actions/types';


const initialState = {
    announcements: null,
    open_announcement: null,
    announcement: null
};

export default function Announcement(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        case GET_ANNOUNCEMENTS_SUCCESS:
            return {
                ...state,
                announcements: payload.announcements
            }
        case GET_ANNOUNCEMENTS_FAIL:
            return {
                ...state, 
                announcements: null
            }


        case GET_ANNOUNCEMENT_SUCCESS:
            return {
                ...state,
                announcement: payload.announcement
            }
        case GET_ANNOUNCEMENT_FAIL:
            return {
                ...state,
                announcement: null
            }
        case GET_OPEN_ANNOUNCEMENT_SUCCESS:
            return {
                ...state,
                open_announcement: payload.announcement
            }
        case GET_OPEN_ANNOUNCEMENT_FAIL:
            return {
                ...state,
                open_announcement: null
            }

        default:
            return state
    }
}