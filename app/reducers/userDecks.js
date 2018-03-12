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

export const UpdateUserDeck = (name, user, cards, deckId) => {
  return function thunk(dispatch) {
    axios.put(`api/user/${user.id}/decks/${deckId}`, ({ name, cards }))
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
      return state.concat([{id:action.deck.id, name:action.deck.name}])
    default:
      return state
  }
}

export default userDeckReducer
