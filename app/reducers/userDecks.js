import axios from 'axios'

// action types
const GET_USER_DECKS = 'GET_USER_DECKS'

export const getUserDecksCards = (userId) => {
  return {
    type: GET_USER_DECKS,
    filteredCards
  }
}

export const fetchUserDecks = (deck, user) => {
  return function thunk(dispatch) {
    axios.get('api/user/decks/' + )
      .then(res => {
        let cards = res.data
        dispatch(getFilteredCards(cards))
        return cards
      })
      .then(cards => {
        return dispatch(getSelectedCard(value, cards))
      })
      .catch(console.error)
  }
}


// sub reducer
const userDecksReducer = (state = [], action) => {
  switch (action.type) {
    case GET_USER_DECKS:
      return action.filteredCards
    default:
      return state
  }
}

export default userDecksReducer
