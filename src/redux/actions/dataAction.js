import { 
    SET_SCREAMS, 
    LOADING_DATA, 
    LIKE_SCREAM, 
    UNLIKE_SCREAM,
    DELETE_SCREAM,
    POST_SCREAM,
    LOADING_UI,
    SET_ERRORS,
    CLEAR_ERRORS
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

export const postScream = newScream => dispatch => {
    dispatch({ type: LOADING_UI })

    axios
    .post('/scream', newScream)
    .then(res => {
        dispatch({
            type: POST_SCREAM,
            payload: res.data
        })
        dispatch({ type: CLEAR_ERRORS })
    })
    .catch(e => {
        dispatch({
            type: SET_ERRORS,
            payload: e.response.data
        })
    })
}