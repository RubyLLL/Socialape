import { 
    SET_USER,  
    SET_AUTHENTICATED, 
    SET_UNAUTHENTICATED
} from '../types'

const initialState = {
    loading: false,
    isAuthenticated: false,
    credentials: {},
    likes: [],
    notifications: []
}

export default function(state = initialState, action) {
    switch(action.type){
        case SET_AUTHENTICATED:
            return {
                ...state,
                isAuthenticated: true
            }
        case SET_UNAUTHENTICATED:
            return initialState
        case SET_USER:
                return {
                  authenticated: true,
                  loading: false,
                  ...action.payload
            }

        default:
            return state
    }
}