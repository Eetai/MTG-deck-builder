import axios from 'axios'

// action types
const GET_USER_DECKS = 'GET_USER_DECKS'
const ADD_DECK = 'ADD_DECK'
const CLEAR_DECKS = 'CLEAR_DECKS'

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

export const clearUserDecks = () => {
  return {
    type: CLEAR_DECKS
  }
}

export const fetchUserDecks = (userId) => {
  return function thunk(dispatch) {
    axios.get(`api/user/${userId}/decks/`)
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
const userDeckReducer = (state = [], action) => {
  switch (action.type) {
    case CLEAR_DECKS:
      return []
    case GET_USER_DECKS:
      return action.decks
    case ADD_DECK:
      const newState = state.filter(deck => deck.name !== action.deck.name)
      return newState.concat({ name: action.deck.name, id: action.deck.id })
    default:
      return state
  }
}

export default userDeckReducer
