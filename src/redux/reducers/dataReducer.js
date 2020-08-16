import { SET_SCREAMS, LOADING_DATA, LIKE_SCREAM, UNLIKE_SCREAM } from '../types'

const initialState = {
    screams: [],
    scream: {},
    loading: false
}

export default function(state = initialState, action) {
    switch(action.type) {
        case SET_SCREAMS:
            return {
                ...state,
                screams: action.payload,
                loading: false
            }

        case LOADING_DATA:
            return {
                ...state,
                loading: true
            }

        case UNLIKE_SCREAM:
        case LIKE_SCREAM:
            // NOTE inside action.payload is the scream,  so we find it from the screams returned
            // NOTE  and add it to scream
            let index = state.screams.findIndex((scream) => scream.screamId === action.payload.screamId)
            state.screams[index] = action.payload
            return {
                ...state
            }

        default:
            return state
    }
}