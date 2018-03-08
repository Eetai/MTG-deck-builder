import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_USER = 'GET_USER'
const REMOVE_USER = 'REMOVE_USER'
/**
 * INITIAL STATE
 */
const defaultUser = {
  user: {}
}

/**
 * ACTION CREATORS
 */
const getUser = user => ({ type: GET_USER, user })
const removeUser = () => ({ type: REMOVE_USER })
/**
 * THUNK CREATORS
 */

export const fetchUser = (userId) =>
  dispatch =>
    axios.get(`/api/users/${userId}`)
      .then(res =>
        dispatch(getUser(res.data)))
      .catch(err => console.log(err))

export const me = () =>
  dispatch =>
    axios.get('api/auth/me')
      .then(res =>
        dispatch(getUser(res.data || defaultUser)))
      .catch(err => console.log(err))

export const auth = (email, password, method) => {
  console.log(method)
  return dispatch =>
    axios.post(`api/auth/${method}`, { email, password })
      .then(res => {
        dispatch(getUser(res.data))
      }, authError => {
        dispatch(getUser({ error: authError }))
      })
      .catch(dispatchOrHistoryErr => console.error(dispatchOrHistoryErr))
  }

export const logout = () =>
  dispatch =>
    axios.post('api/auth/logout')
      .then(_ => {
        dispatch(removeUser())
      })
      .catch(err => console.log(err))

/**
 * REDUCER
 */
export default function (state = defaultUser, action) {
  switch (action.type) {
    case GET_USER:
      return action.user;
    case REMOVE_USER:
      return defaultUser
    default:
      return state
  }
}
