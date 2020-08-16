// Point of doing this is later when we call these actions, if we misspell the names the program will crash, makes it easy to spot it

// user reducer types
export const SET_AUTHENTICATED = 'SET_AUTHENTICATED'
export const SET_UNAUTHENTICATED = 'SET_UNAUTHENTICATED'
export const SET_USER = 'SET_USER'
export const LOADING_USER = 'LOADING_USER'

// data reducer types
export const SET_SCREAMS = 'SET_SCREAMS '
export const LOADING_DATA = 'LOADING_DATA '
export const LIKE_SCREAM = 'LIKE_SCREAM'
export const UNLIKE_SCREAM = 'UNLIKE_SCREAM'
export const DELETE_SCREAM = 'DELETE_SCREAM'
export const POST_SCREAM = 'POST_SCREAM'

// ui reducer types
export const SET_ERRORS = 'SET_ERRORS'
export const LOADING_UI = 'LOADING_UI'
export const CLEAR_ERRORS = 'CLEAR_ERRORS'
