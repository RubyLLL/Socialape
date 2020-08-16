import { 
    SET_SCREAMS, 
    LOADING_DATA, 
    LIKE_SCREAM, 
    UNLIKE_SCREAM,
    DELETE_SCREAM
 } from '../types'
import axios from 'axios'

// Get all screams
export const getScreams = () => dispatch => {
    dispatch({ type: LOADING_DATA })

    axios
    .get('/screams')
    .then(res => {
        dispatch({ 
            type: SET_SCREAMS,
            payload: res.data
        })
    })
    .catch(e => {
        dispatch({
            type: SET_SCREAMS,
            payload: []
        })
    })
}

export const likeScream = screamId => dispatch => {
    axios
    .get(`/scream/${screamId}/like`)
    .then(res => {
        console.log(res.data)
        dispatch({
            type: LIKE_SCREAM,
            payload: res.data
        })
    })
    .catch(e => console.log(e))
}

export const unlikeScream = screamId => dispatch => {
    axios
    .get(`/scream/${screamId}/unlike`)
    .then(res => {
        dispatch({
            type: UNLIKE_SCREAM,
            payload: res.data
        })
    })
    .catch(e => console.log(e))

}

export const deleteScream = screamId => dispatch => {
    axios
    .delete(`/scream/${screamId}`)
    .then(res => {
        dispatch({
            type: DELETE_SCREAM,
            payload: screamId
        })
    })
    .catch(e => console.log(e))
}