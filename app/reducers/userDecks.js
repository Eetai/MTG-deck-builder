import axios from 'axios'

// action types
const GET_USER_DECKS = 'GET_USER_DECKS'
const ADD_DECK = 'ADD_DECK'

export const getUserDecks = (decks) => {
  return {
    type: GET_USER_DECKS,
    decks
  }
}

export const addDeck = (deck) => {
  return {
    type: ADD_DECK,
    deck
  }
}

export const fetchUserDecks = (user) => {
  return function thunk(dispatch) {
    axios.get(`api/user/${user.id}/decks/`)
      .then(res => {
        let decks = res.data
        dispatch(getUserDecks(decks))
      })
      .catch(console.error)
  }
}

export const SaveUserDecks = (name, user, cards) => {
  return function thunk(dispatch) {
    axios.post(`api/user/${user.id}/decks/`, ({ name, cards }))
      .then(res => {
        let deck = res.data
        dispatch(addDeck(deck))
      })
      .catch(console.error)
  }
}

// sub reducer
const userDecksReducer = (state = [], action) => {
  switch (action.type) {
    case GET_USER_DECKS:
      return action.decks
    case ADD_DECK:
      return state.concat([action.deck])
    default:
      return state
  }
}

export default userDecksReducer
