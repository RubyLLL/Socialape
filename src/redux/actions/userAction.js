import { 
    SET_ERRORS, 
    LOADING_UI, 
    CLEAR_ERRORS, 
    SET_USER, 
    SET_AUTHENTICATED
} from '../types'
import axios from 'axios'

export const loginUser = (userData, history) => (dispatch) => {
    dispatch({ type: LOADING_UI })
    axios
    .post('/login', userData)
    .then(result => {
        setAuthorizationHeader(result.data.token)
        dispatch(getUserData())
        dispatch({ type: CLEAR_ERRORS })
        // ANCHOR https://reactrouter.com/web/api/history
        // this will redirect us to the home page
        history.push('/')
    })
    .catch(e => {
        dispatch({
            type: SET_ERRORS,
            payload: e.response.data
        })
    })
} 

export const getUserData = () => (dispatch) => {
    axios
      .get('/user')
      .then((res) => {
          console.log(res)
          dispatch({
            type: SET_USER,
            payload: res.data
            });
      })
      .catch((err) => console.log(err));
  }

  const setAuthorizationHeader = (token) => {
    const FBIdToken = `Bearer ${token}`;
    localStorage.setItem('FBIdToken', FBIdToken);
    axios.defaults.headers.common['Authorization'] = FBIdToken;
  };