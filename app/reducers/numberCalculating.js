const UPDATE_NUMBER_CALCULATING = 'UPDATE_NUMBER_CALCULATING'
const SET_NUMBER_CALCULATING = 'SET_NUMBER_CALCULATING'

// action creator
export const updateNumberCalculated = (number) => {
  return {
    type: UPDATE_NUMBER_CALCULATING,
    number
  }
}

export const setNumberCalculated = (number) => {
  return {
    type: SET_NUMBER_CALCULATING,
    number
  }
}

//sub reducer
const numberCalculatingReducer = (state = 0, action) => {
  switch (action.type) {
    case SET_NUMBER_CALCULATING:
      return action.number
    case UPDATE_NUMBER_CALCULATING:
      return state + action.number
    default:
      return state
  }
}

export default numberCalculatingReducer
