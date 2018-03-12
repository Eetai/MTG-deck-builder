const SELECT_DECK = 'SELECT_DECK'


// action creator
export const selectDeck = (name) => {
  return {
    type: SELECT_DECK,
    name
  }
}


//sub reducer
const selectedDeckReducer = (state = '', action) => {
  switch (action.type) {
    case SELECT_DECK:
      return action.name
    default:
      return state
  }
}

export default selectedDeckReducer
